import { useState } from 'react'
import { Link } from 'react-router-dom'

import RelatorioResultado from '../components/RelatorioResultado'
import { usePedidos } from '../contexts/PedidosContext'

import '../styles/Relatorios.css'

function RelatorioPedidos() {
  const { pedidos } = usePedidos()

  const [clienteSelecionado, setClienteSelecionado] =
    useState('')
  const [statusSelecionado, setStatusSelecionado] =
    useState('')
  const [resultados, setResultados] = useState([])
  const [mensagem, setMensagem] = useState('')
  const [relatorioGerado, setRelatorioGerado] =
    useState(false)

  const dadosDisponiveis = Array.isArray(pedidos)

  const clientes = dadosDisponiveis
    ? [
        ...new Set(
          pedidos
            .map((pedido) => pedido.cliente)
            .filter(Boolean)
        ),
      ].sort((clienteA, clienteB) =>
        clienteA.localeCompare(clienteB, 'pt-BR')
      )
    : []

  const statusPedidos = dadosDisponiveis
    ? [
        ...new Set(
          pedidos
            .map((pedido) => pedido.status)
            .filter(Boolean)
        ),
      ].sort((statusA, statusB) =>
        statusA.localeCompare(statusB, 'pt-BR')
      )
    : []

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

    if (!dadosDisponiveis) {
      setMensagem('Erro ao carregar pedidos.')
      setResultados([])
      setRelatorioGerado(false)
      return
    }

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
        {!dadosDisponiveis && (
          <div
            className="relatorio-alerta"
            role="alert"
          >
            Erro ao carregar pedidos.
          </div>
        )}

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
              disabled={!dadosDisponiveis}
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
              disabled={!dadosDisponiveis}
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
            disabled={!dadosDisponiveis}
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