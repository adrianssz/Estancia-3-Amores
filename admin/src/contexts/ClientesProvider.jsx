import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import { supabase } from '../services/supabase'
import ClientesContext from './ClientesContext'

function normalizarCliente(cliente) {
  return {
    ...cliente,
    codigo: cliente.id,
  }
}

async function buscarClientes() {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .order('id', { ascending: true })

  if (error) {
    throw error
  }

  return (data ?? []).map(normalizarCliente)
}

function ClientesProvider({ children }) {
  const [clientes, setClientes] = useState([])
  const [carregandoClientes, setCarregandoClientes] =
    useState(true)
  const [erroClientes, setErroClientes] = useState('')

  const carregarClientes = useCallback(async () => {
    setCarregandoClientes(true)
    setErroClientes('')

    try {
      const dados = await buscarClientes()

      setClientes(dados)
    } catch (error) {
      console.error(
        'Erro ao carregar clientes:',
        error
      )

      setClientes([])
      setErroClientes(
        'Não foi possível carregar os clientes.'
      )
    } finally {
      setCarregandoClientes(false)
    }
  }, [])

  useEffect(() => {
    let ativo = true

    buscarClientes()
      .then((dados) => {
        if (!ativo) {
          return
        }

        setClientes(dados)
        setCarregandoClientes(false)
      })
      .catch((error) => {
        if (!ativo) {
          return
        }

        console.error(
          'Erro ao carregar clientes:',
          error
        )

        setClientes([])
        setErroClientes(
          'Não foi possível carregar os clientes.'
        )
        setCarregandoClientes(false)
      })

    return () => {
      ativo = false
    }
  }, [])

  async function adicionarCliente(novoCliente) {
    const dadosCliente = {
      nome: novoCliente.nome,
      telefone: novoCliente.telefone,
      endereco: novoCliente.endereco,
    }

    const { data, error } = await supabase
      .from('clientes')
      .insert(dadosCliente)
      .select('*')
      .single()

    if (error) {
      throw error
    }

    const clienteNormalizado = normalizarCliente(data)

    setClientes((clientesAtuais) => [
      ...clientesAtuais,
      clienteNormalizado,
    ])

    return clienteNormalizado
  }

  async function editarCliente(codigo, dadosAtualizados) {
    const dadosCliente = {
      nome: dadosAtualizados.nome,
      telefone: dadosAtualizados.telefone,
      endereco: dadosAtualizados.endereco,
    }

    const { data, error } = await supabase
      .from('clientes')
      .update(dadosCliente)
      .eq('id', codigo)
      .select('*')
      .single()

    if (error) {
      throw error
    }

    const clienteNormalizado = normalizarCliente(data)

    setClientes((clientesAtuais) =>
      clientesAtuais.map((cliente) =>
        cliente.codigo === codigo
          ? clienteNormalizado
          : cliente
      )
    )

    return clienteNormalizado
  }

  async function excluirCliente(codigo) {
    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', codigo)

    if (error) {
      throw error
    }

    setClientes((clientesAtuais) =>
      clientesAtuais.filter(
        (cliente) => cliente.codigo !== codigo
      )
    )
  }

  return (
    <ClientesContext.Provider
      value={{
        clientes,
        carregandoClientes,
        erroClientes,
        carregarClientes,
        adicionarCliente,
        editarCliente,
        excluirCliente,
      }}
    >
      {children}
    </ClientesContext.Provider>
  )
}

export default ClientesProvider