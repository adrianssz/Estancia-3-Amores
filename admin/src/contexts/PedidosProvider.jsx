import {
  useEffect,
  useState,
} from 'react'

import { supabase } from '../services/supabase'
import { useAuth } from './AuthContext'
import { useProdutos } from './ProdutosContext'
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
    data: formatarDataParaInterface(pedido.data),
    itens: normalizarItens(pedido.pedido_itens),
  }
}

function mensagemDoErro(error, mensagemPadrao) {
  // P0001 identifica as mensagens de validação das RPCs.
  if (error?.code === 'P0001' && error.message) {
    return error.message
  }

  return mensagemPadrao
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

  const { carregarProdutos } = useProdutos()

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

      const { data, error } = await supabase
        .from('pedidos')
        .select(CAMPOS_PEDIDO)
        .order('id', { ascending: true })

      if (!ativo) {
        return
      }

      if (error) {
        console.error('Erro ao carregar pedidos:', error)
        setPedidos([])
        setErro('Não foi possível carregar os pedidos.')
        setCarregando(false)
        return
      }

      setPedidos((data ?? []).map(normalizarPedido))
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

  async function salvarPedido(dadosPedido, id = null) {
    const editando = id !== null

    const parametros = {
      p_cliente_id: dadosPedido.clienteId,
      p_telefone: dadosPedido.telefone,
      p_status: dadosPedido.status,
      p_data: formatarDataParaBanco(dadosPedido.data),
      p_itens: dadosPedido.itens.map((item) => ({
        produto_id: item.produtoId,
        quantidade: item.quantidade,
      })),
    }

    if (editando) {
      parametros.p_pedido_id = id
    }

    const { data, error } = await supabase.rpc(
      editando
        ? 'editar_pedido_com_itens'
        : 'criar_pedido_com_itens',
      parametros
    )

    if (error) {
      console.error('Erro ao salvar pedido:', error)

      // Outra operação pode ter alterado o estoque disponível.
      await carregarProdutos()

      return {
        sucesso: false,
        mensagem: mensagemDoErro(
          error,
          editando
            ? 'Não foi possível editar o pedido.'
            : 'Não foi possível adicionar o pedido.'
        ),
      }
    }

    // A RPC já confirmou o pedido e a movimentação de estoque.
    await carregarProdutos()

    const pedidoRetornado = Array.isArray(data)
      ? data[0]
      : data

    if (!pedidoRetornado?.id) {
      console.error(
        'Retorno inesperado ao salvar pedido:',
        data
      )

      return {
        sucesso: false,
        mensagem:
          'O pedido foi processado, mas houve erro ao atualizar a listagem. Recarregue a página antes de tentar novamente.',
      }
    }

    try {
      const pedidoSalvo = await buscarPedidoCompleto(
        pedidoRetornado.id
      )

      setPedidos((pedidosAtuais) => {
        const existe = pedidosAtuais.some(
          (pedido) => pedido.id === pedidoSalvo.id
        )

        if (existe) {
          return pedidosAtuais.map((pedido) =>
            pedido.id === pedidoSalvo.id
              ? pedidoSalvo
              : pedido
          )
        }

        return [...pedidosAtuais, pedidoSalvo]
      })

      return {
        sucesso: true,
        pedido: pedidoSalvo,
      }
    } catch (erroConsulta) {
      console.error(
        'Pedido salvo, mas não foi possível consultar seus itens:',
        erroConsulta
      )

      return {
        sucesso: false,
        mensagem:
          'O pedido foi salvo, mas a listagem não foi atualizada. Recarregue a página antes de tentar novamente.',
      }
    }
  }

  async function adicionarPedido(novoPedido) {
    return salvarPedido(novoPedido)
  }

  async function editarPedido(id, dadosAtualizados) {
    return salvarPedido(dadosAtualizados, id)
  }

  async function excluirPedido(id) {
    const { data, error } = await supabase.rpc(
      'excluir_pedido_com_estoque',
      { p_pedido_id: id }
    )

    if (error) {
      console.error('Erro ao excluir pedido:', error)

      return {
        sucesso: false,
        mensagem: mensagemDoErro(
          error,
          'Não foi possível excluir o pedido.'
        ),
      }
    }

    if (String(data) !== String(id)) {
      console.error(
        'Retorno inesperado ao excluir pedido:',
        data
      )

      await carregarProdutos()

      return {
        sucesso: false,
        mensagem:
          'A exclusão foi processada, mas não foi possível confirmar a atualização. Recarregue a página.',
      }
    }

    setPedidos((pedidosAtuais) =>
      pedidosAtuais.filter((pedido) => pedido.id !== id)
    )

    await carregarProdutos()

    return { sucesso: true }
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