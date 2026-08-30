import { useState } from 'react'
import { Link } from 'react-router-dom'

import RelatorioResultado from '../components/RelatorioResultado'
import { useClientes } from '../contexts/ClientesContext'
import { usePedidos } from '../contexts/PedidosContext'

import '../styles/Relatorios.css'

function RelatorioClientes() {
  const { clientes } = useClientes()
  const { pedidos } = usePedidos()

  const [clienteSelecionado, setClienteSelecionado] =
    useState('')
  const [statusSelecionado, setStatusSelecionado] =
    useState('')
  const [resultados, setResultados] = useState([])
  const [mensagem, setMensagem] = useState('')
  const [relatorioGerado, setRelatorioGerado] =
    useState(false)

  const clientesDisponiveis = Array.isArray(clientes)
  const pedidosDisponiveis = Array.isArray(pedidos)

  const nomesClientes = clientesDisponiveis
    ? [
        ...new Set(
          clientes
            .map((cliente) => cliente.nome)
            .filter(Boolean)
        ),
      ].sort((clienteA, clienteB) =>
        clienteA.localeCompare(clienteB, 'pt-BR')
      )
    : []

  const statusClientes = clientesDisponiveis
    ? [
        ...new Set(
          clientes
            .map((cliente) => cliente.status)
            .filter(Boolean)
        ),
      ].sort((statusA, statusB) =>
        statusA.localeCompare(statusB, 'pt-BR')
      )
    : []

  function contarPedidos(cliente) {
    if (!pedidosDisponiveis) {
      return 0
    }

    return pedidos.filter(
      (pedido) => pedido.cliente === cliente.nome
    ).length
  }

  const colunas = [
    {
      chave: 'codigo',
      titulo: 'Código',
    },
    {
      chave: 'nome',
      titulo: 'Nome',
    },
    {
      chave: 'telefone',
      titulo: 'Telefone',
    },
    {
      chave: 'endereco',
      titulo: 'Endereço',
    },
    {
      chave: 'status',
      titulo: 'Status',
      render: (cliente) =>
        cliente.status || 'Não definido',
    },
    {
      chave: 'pedidos',
      titulo: 'Pedidos',
      render: (cliente) =>
        contarPedidos(cliente),
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

    if (!clientesDisponiveis) {
      setMensagem('Erro ao carregar dados dos clientes.')
      setResultados([])
      setRelatorioGerado(false)
      return
    }

    const clientesFiltrados = clientes.filter(
      (cliente) => {
        const correspondeCliente =
          !clienteSelecionado ||
          cliente.nome === clienteSelecionado

        const correspondeStatus =
          !statusSelecionado ||
          cliente.status === statusSelecionado

        return (
          correspondeCliente &&
          correspondeStatus
        )
      }
    )

    if (clientesFiltrados.length === 0) {
      setMensagem(
        'Nenhum cliente encontrado para os filtros selecionados.'
      )
      setResultados([])
      setRelatorioGerado(false)
      return
    }

    setResultados(clientesFiltrados)
    setMensagem('')
    setRelatorioGerado(true)
  }

  if (relatorioGerado) {
    return (
      <main className="relatorio-page">
        <RelatorioResultado
          titulo="Relatório de Clientes"
          resultados={resultados}
          colunas={colunas}
          chaveRegistro="codigo"
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
        <h1>Relatório Clientes</h1>

        <p>
          Defina os parâmetros para gerar o relatório
          de clientes.
        </p>
      </section>

      <section className="relatorio-conteudo">
        {!clientesDisponiveis && (
          <div
            className="relatorio-alerta"
            role="alert"
          >
            Erro ao carregar dados dos clientes.
          </div>
        )}

        <form
          className="relatorio-form"
          onSubmit={handleSubmit}
        >
          <div className="relatorio-campo">
            <label htmlFor="relatorio-cliente">
              Cliente
            </label>

            <select
              id="relatorio-cliente"
              value={clienteSelecionado}
              onChange={handleClienteChange}
              disabled={!clientesDisponiveis}
            >
              <option value="">
                Todos os clientes
              </option>

              {nomesClientes.map((cliente) => (
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
            <label htmlFor="relatorio-cliente-status">
              Status
            </label>

            <select
              id="relatorio-cliente-status"
              value={statusSelecionado}
              onChange={handleStatusChange}
              disabled={
                !clientesDisponiveis ||
                statusClientes.length === 0
              }
            >
              <option value="">
                {statusClientes.length === 0
                  ? 'Status não disponível no modelo atual'
                  : 'Todos os status'}
              </option>

              {statusClientes.map((status) => (
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
            disabled={!clientesDisponiveis}
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

export default RelatorioClientes