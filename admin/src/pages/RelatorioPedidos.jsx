import {
  useEffect,
  useState,
} from 'react'
import { Link } from 'react-router-dom'

import RelatorioResultado from '../components/RelatorioResultado'
import { supabase } from '../services/supabase'

import '../styles/Relatorios.css'

function RelatorioPedidos() {
  const [pedidos, setPedidos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  const [clienteSelecionado, setClienteSelecionado] =
    useState('')

  const [statusSelecionado, setStatusSelecionado] =
    useState('')

  const [resultados, setResultados] = useState([])
  const [mensagem, setMensagem] = useState('')

  const [relatorioGerado, setRelatorioGerado] =
    useState(false)

  useEffect(() => {
    let ativo = true

    async function carregarPedidos() {
      setCarregando(true)
      setErro('')

      const { data, error } = await supabase
        .from('pedidos')
        .select(`
          id,
          cliente_id,
          telefone,
          status,
          data,
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
          'Erro ao carregar pedidos para o relatório:',
          error
        )

        setPedidos([])
        setErro('Erro ao carregar pedidos.')
        setCarregando(false)
        return
      }

      const pedidosNormalizados = (data ?? []).map(
        (pedido) => ({
          id: pedido.id,
          clienteId: pedido.cliente_id,
          cliente:
            pedido.clientes?.nome ??
            'Cliente não encontrado',
          telefone: pedido.telefone,
          status: pedido.status,
          data: pedido.data,
        })
      )

      setPedidos(pedidosNormalizados)
      setCarregando(false)
    }

    carregarPedidos()

    return () => {
      ativo = false
    }
  }, [])

  const clientes = [
    ...new Set(
      pedidos
        .map((pedido) => pedido.cliente)
        .filter(
          (cliente) =>
            cliente &&
            cliente !== 'Cliente não encontrado'
        )
    ),
  ].sort((clienteA, clienteB) =>
    clienteA.localeCompare(clienteB, 'pt-BR')
  )

  const statusPedidos = [
    ...new Set(
      pedidos
        .map((pedido) => pedido.status)
        .filter(Boolean)
    ),
  ].sort((statusA, statusB) =>
    statusA.localeCompare(statusB, 'pt-BR')
  )

  function formatarData(data) {
    if (!data) {
      return ''
    }

    const partes = data.split('-')

    if (partes.length !== 3) {
      return data
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`
  }

  const colunas = [
    {
      chave: 'id',
      titulo: 'Pedido',
    },
    {
      chave: 'cliente',
      titulo: 'Cliente',
    },
    {
      chave: 'telefone',
      titulo: 'Telefone',
    },
    {
      chave: 'status',
      titulo: 'Status',
    },
    {
      chave: 'data',
      titulo: 'Data',
      render: (pedido) =>
        formatarData(pedido.data),
    },
  ]

  function limparResultadoAnterior() {
    setResultados([])
    setMensagem('')
    setRelatorioGerado(false)
  }

  function handleClienteChange(event) {
    setClienteSelecionado(event.target.value)
    limparResultadoAnterior()
  }

  function handleStatusChange(event) {
    setStatusSelecionado(event.target.value)
    limparResultadoAnterior()
  }

  function handleSubmit(event) {
    event.preventDefault()

    const pedidosFiltrados = pedidos.filter(
      (pedido) => {
        const correspondeCliente =
          !clienteSelecionado ||
          pedido.cliente === clienteSelecionado

        const correspondeStatus =
          !statusSelecionado ||
          pedido.status === statusSelecionado

        return (
          correspondeCliente &&
          correspondeStatus
        )
      }
    )

    if (pedidosFiltrados.length === 0) {
      setMensagem(
        'Nenhum pedido encontrado para os filtros selecionados.'
      )
      setResultados([])
      setRelatorioGerado(false)
      return
    }

    setResultados(pedidosFiltrados)
    setMensagem('')
    setRelatorioGerado(true)
  }

  if (carregando) {
    return (
      <main className="relatorio-page">
        <section className="relatorio-cabecalho">
          <h1>Relatório Pedidos</h1>

          <p>Carregando pedidos...</p>
        </section>
      </main>
    )
  }

  if (erro) {
    return (
      <main className="relatorio-page">
        <section className="relatorio-cabecalho">
          <h1>Relatório Pedidos</h1>
        </section>

        <section className="relatorio-conteudo">
          <div
            className="relatorio-alerta"
            role="alert"
          >
            {erro}
          </div>

          <Link
            to="/relatorios"
            className="relatorio-retornar"
          >
            Retornar a Relatórios
          </Link>
        </section>
      </main>
    )
  }

  if (relatorioGerado) {
    return (
      <main className="relatorio-page">
        <RelatorioResultado
          titulo="Relatório de Pedidos"
          resultados={resultados}
          colunas={colunas}
          chaveRegistro="id"
          onRetornar={() =>
            setRelatorioGerado(false)
          }
        />
      </main>
    )
  }

  return (
    <main className="relatorio-page">
      <section className="relatorio-cabecalho">
        <h1>Relatório Pedidos</h1>

        <p>
          Defina os parâmetros para gerar o relatório
          de pedidos.
        </p>
      </section>

      <section className="relatorio-conteudo">
        <form
          className="relatorio-form"
          onSubmit={handleSubmit}
        >
          <div className="relatorio-campo">
            <label htmlFor="relatorio-pedido-cliente">
              Cliente
            </label>

            <select
              id="relatorio-pedido-cliente"
              value={clienteSelecionado}
              onChange={handleClienteChange}
            >
              <option value="">
                Todos os clientes
              </option>

              {clientes.map((cliente) => (
                <option
                  key={cliente}
                  value={cliente}
                >
                  {cliente}
                </option>
              ))}
            </select>
          </div>

          <div className="relatorio-campo">
            <label htmlFor="relatorio-pedido-status">
              Status
            </label>

            <select
              id="relatorio-pedido-status"
              value={statusSelecionado}
              onChange={handleStatusChange}
            >
              <option value="">
                Todos os status
              </option>

              {statusPedidos.map((status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>
              ))}
            </select>
          </div>

          {mensagem && (
            <div
              className="relatorio-alerta"
              role="alert"
              aria-live="polite"
            >
              {mensagem}
            </div>
          )}

          <button
            type="submit"
            className="relatorio-gerar"
          >
            Gerar Relatório
          </button>
        </form>

        <Link
          to="/relatorios"
          className="relatorio-retornar"
        >
          Retornar a Relatórios
        </Link>
      </section>
    </main>
  )
}

export default RelatorioPedidos