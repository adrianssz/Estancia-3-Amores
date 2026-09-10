import {
  useEffect,
  useState,
} from 'react'

import { supabase } from '../services/supabase'
import { useAuth } from './AuthContext'
import EntregasContext from './EntregasContext'


function formatarDataParaInterface(data) {
  if (!data) {
    return ''
  }

  const partes = data.split('-')

  if (partes.length !== 3) {
    return data
  }

  const [ano, mes, dia] = partes

  return `${dia}/${mes}/${ano}`
}


function formatarDataParaBanco(data) {
  if (!data) {
    return ''
  }

  const partes = data.split('/')

  if (partes.length !== 3) {
    return data
  }

  const [dia, mes, ano] = partes

  return `${ano}-${mes}-${dia}`
}


function normalizarEntrega(entrega) {
  return {
    id: entrega.id,
    codigo: entrega.id,
    clienteId: entrega.cliente_id,
    cliente:
      entrega.clientes?.nome ??
      entrega.cliente ??
      'Cliente não encontrado',
    endereco: entrega.endereco,
    data: formatarDataParaInterface(
      entrega.data
    ),
    status: entrega.status,
  }
}


function EntregasProvider({ children }) {
  const {
    autenticado,
    carregando: carregandoAutenticacao,
  } = useAuth()

  const [entregas, setEntregas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')


  useEffect(() => {
    let ativo = true

    async function carregarEntregas() {
      if (carregandoAutenticacao) {
        return
      }

      if (!autenticado) {
        if (ativo) {
          setEntregas([])
          setErro('')
          setCarregando(false)
        }

        return
      }

      setCarregando(true)
      setErro('')

      const {
        data,
        error,
      } = await supabase
        .from('entregas')
        .select(`
          id,
          cliente_id,
          data,
          endereco,
          status,
          clientes (
            nome
          )
        `)
        .order('id', {
          ascending: true,
        })

      if (!ativo) {
        return
      }

      if (error) {
        console.error(
          'Erro ao carregar entregas:',
          error
        )

        setEntregas([])
        setErro(
          'Não foi possível carregar as entregas.'
        )
        setCarregando(false)
        return
      }

      setEntregas(
        (data ?? []).map(normalizarEntrega)
      )

      setCarregando(false)
    }

    carregarEntregas()

    return () => {
      ativo = false
    }
  }, [
    autenticado,
    carregandoAutenticacao,
  ])


  async function adicionarEntrega(novaEntrega) {
    const {
      data,
      error,
    } = await supabase
      .from('entregas')
      .insert([
        {
          cliente_id: novaEntrega.clienteId,
          data: formatarDataParaBanco(
            novaEntrega.data
          ),
          endereco:
            novaEntrega.endereco.trim(),
          status: novaEntrega.status,
        },
      ])
      .select(`
        id,
        cliente_id,
        data,
        endereco,
        status
      `)
      .single()

    if (error) {
      console.error(
        'Erro ao adicionar entrega:',
        error
      )

      return {
        sucesso: false,
        mensagem:
          'Não foi possível adicionar a entrega.',
      }
    }

    const entregaCriada = normalizarEntrega({
      ...data,
      cliente: novaEntrega.cliente,
    })

    setEntregas((entregasAtuais) => [
      ...entregasAtuais,
      entregaCriada,
    ])

    return {
      sucesso: true,
      entrega: entregaCriada,
    }
  }


  async function editarEntrega(
    codigo,
    dadosAtualizados
  ) {
    const {
      data,
      error,
    } = await supabase
      .from('entregas')
      .update({
        cliente_id:
          dadosAtualizados.clienteId,
        data: formatarDataParaBanco(
          dadosAtualizados.data
        ),
        endereco:
          dadosAtualizados.endereco.trim(),
        status:
          dadosAtualizados.status,
      })
      .eq('id', codigo)
      .select(`
        id,
        cliente_id,
        data,
        endereco,
        status
      `)
      .single()

    if (error) {
      console.error(
        'Erro ao editar entrega:',
        error
      )

      return {
        sucesso: false,
        mensagem:
          'Não foi possível editar a entrega.',
      }
    }

    const entregaEditada = normalizarEntrega({
      ...data,
      cliente:
        dadosAtualizados.cliente,
    })

    setEntregas((entregasAtuais) =>
      entregasAtuais.map((entrega) =>
        entrega.codigo === codigo
          ? entregaEditada
          : entrega
      )
    )

    return {
      sucesso: true,
      entrega: entregaEditada,
    }
  }


  async function excluirEntrega(codigo) {
    const { error } = await supabase
      .from('entregas')
      .delete()
      .eq('id', codigo)

    if (error) {
      console.error(
        'Erro ao excluir entrega:',
        error
      )

      return {
        sucesso: false,
        mensagem:
          'Não foi possível excluir a entrega.',
      }
    }

    setEntregas((entregasAtuais) =>
      entregasAtuais.filter(
        (entrega) =>
          entrega.codigo !== codigo
      )
    )

    return {
      sucesso: true,
    }
  }


  return (
    <EntregasContext.Provider
      value={{
        entregas,
        carregando,
        erro,
        adicionarEntrega,
        editarEntrega,
        excluirEntrega,
      }}
    >
      {children}
    </EntregasContext.Provider>
  )
}


export default EntregasProvider