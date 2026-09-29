import {
  useEffect,
  useState,
} from 'react'

import { supabase } from '../services/supabase'
import { useAuth } from './AuthContext'
import PedidosContext from './PedidosContext'


const CAMPOS_PEDIDO = `
  id,
  cliente_id,
  telefone,
  status,
  data,
  clientes (
    nome
  ),
  pedido_itens (
    produto_id,
    quantidade,
    preco_unitario
  )
`


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


function normalizarItens(itens) {
  if (!Array.isArray(itens)) {
    return []
  }

  return itens.map((item) => ({
    produtoId: item.produto_id,
    quantidade: item.quantidade,
    precoUnitario: item.preco_unitario,
  }))
}


function normalizarPedido(pedido) {
  return {
    id: pedido.id,
    clienteId: pedido.cliente_id,
    cliente:
      pedido.clientes?.nome ??
      pedido.cliente ??
      'Cliente não encontrado',
    telefone: pedido.telefone,
    status: pedido.status,
    data: formatarDataParaInterface(
      pedido.data
    ),
    itens: normalizarItens(
      pedido.pedido_itens
    ),
  }
}


async function buscarPedidoCompleto(id) {
  const { data, error } = await supabase
    .from('pedidos')
    .select(CAMPOS_PEDIDO)
    .eq('id', id)
    .single()

  if (error) {
    throw error
  }

  return normalizarPedido(data)
}


function PedidosProvider({ children }) {
  const {
    autenticado,
    carregando: carregandoAutenticacao,
  } = useAuth()

  const [pedidos, setPedidos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')


  useEffect(() => {
    let ativo = true

    async function carregarPedidos() {
      if (carregandoAutenticacao) {
        return
      }

      if (!autenticado) {
        if (ativo) {
          setPedidos([])
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
        .from('pedidos')
        .select(CAMPOS_PEDIDO)
        .order('id', {
          ascending: true,
        })

      if (!ativo) {
        return
      }

      if (error) {
        console.error(
          'Erro ao carregar pedidos:',
          error
        )

        setPedidos([])
        setErro(
          'Não foi possível carregar os pedidos.'
        )
        setCarregando(false)
        return
      }

      setPedidos(
        (data ?? []).map(normalizarPedido)
      )
      setCarregando(false)
    }

    carregarPedidos()

    return () => {
      ativo = false
    }
  }, [
    autenticado,
    carregandoAutenticacao,
  ])


  async function adicionarPedido(novoPedido) {
    const {
      data,
      error,
    } = await supabase.rpc(
      'criar_pedido_com_itens',
      {
        p_cliente_id: novoPedido.clienteId,
        p_telefone: novoPedido.telefone,
        p_status: novoPedido.status,
        p_data: formatarDataParaBanco(
          novoPedido.data
        ),
        p_itens: novoPedido.itens.map(
          (item) => ({
            produto_id: item.produtoId,
            quantidade: item.quantidade,
          })
        ),
      }
    )

    if (error) {
      console.error(
        'Erro ao adicionar pedido:',
        error
      )

      return {
        sucesso: false,
        mensagem:
          'Não foi possível adicionar o pedido.',
      }
    }

    const pedidoRetornado = Array.isArray(data)
      ? data[0]
      : data

    if (!pedidoRetornado?.id) {
      console.error(
        'Retorno inesperado ao adicionar pedido:',
        data
      )

      return {
        sucesso: false,
        mensagem:
          'O pedido foi processado, mas houve erro ao atualizar a listagem. Recarregue a página.',
      }
    }

    try {
      const pedidoCriado = await buscarPedidoCompleto(
        pedidoRetornado.id
      )

      setPedidos((pedidosAtuais) => [
        ...pedidosAtuais,
        pedidoCriado,
      ])

      return {
        sucesso: true,
        pedido: pedidoCriado,
      }
    } catch (erroConsulta) {
      console.error(
        'Pedido criado, mas não foi possível consultar seus itens:',
        erroConsulta
      )

      return {
        sucesso: false,
        mensagem:
          'O pedido foi salvo, mas a listagem não foi atualizada. Recarregue a página antes de tentar novamente.',
      }
    }
  }


  async function editarPedido(
    id,
    dadosAtualizados
  ) {
    const {
      data,
      error,
    } = await supabase.rpc(
      'editar_pedido_com_itens',
      {
        p_pedido_id: id,
        p_cliente_id:
          dadosAtualizados.clienteId,
        p_telefone:
          dadosAtualizados.telefone,
        p_status:
          dadosAtualizados.status,
        p_data: formatarDataParaBanco(
          dadosAtualizados.data
        ),
        p_itens: dadosAtualizados.itens.map(
          (item) => ({
            produto_id: item.produtoId,
            quantidade: item.quantidade,
          })
        ),
      }
    )

    if (error) {
      console.error(
        'Erro ao editar pedido:',
        error
      )

      return {
        sucesso: false,
        mensagem:
          'Não foi possível editar o pedido.',
      }
    }

    const pedidoRetornado = Array.isArray(data)
      ? data[0]
      : data

    if (!pedidoRetornado?.id) {
      console.error(
        'Retorno inesperado ao editar pedido:',
        data
      )

      return {
        sucesso: false,
        mensagem:
          'O pedido foi processado, mas houve erro ao atualizar a listagem. Recarregue a página.',
      }
    }

    try {
      const pedidoEditado = await buscarPedidoCompleto(
        pedidoRetornado.id
      )

      setPedidos((pedidosAtuais) =>
        pedidosAtuais.map((pedido) =>
          pedido.id === id
            ? pedidoEditado
            : pedido
        )
      )

      return {
        sucesso: true,
        pedido: pedidoEditado,
      }
    } catch (erroConsulta) {
      console.error(
        'Pedido editado, mas não foi possível consultar seus itens:',
        erroConsulta
      )

      return {
        sucesso: false,
        mensagem:
          'O pedido foi salvo, mas a listagem não foi atualizada. Recarregue a página antes de tentar novamente.',
      }
    }
  }


  async function excluirPedido(id) {
    const { error } = await supabase
      .from('pedidos')
      .delete()
      .eq('id', id)

    if (error) {
      console.error(
        'Erro ao excluir pedido:',
        error
      )

      return {
        sucesso: false,
        mensagem:
          'Não foi possível excluir o pedido.',
      }
    }

    setPedidos((pedidosAtuais) =>
      pedidosAtuais.filter(
        (pedido) => pedido.id !== id
      )
    )

    return {
      sucesso: true,
    }
  }


  return (
    <PedidosContext.Provider
      value={{
        pedidos,
        carregando,
        erro,
        adicionarPedido,
        editarPedido,
        excluirPedido,
      }}
    >
      {children}
    </PedidosContext.Provider>
  )
}


export default PedidosProvider