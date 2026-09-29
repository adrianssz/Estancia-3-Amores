import { useState } from 'react'
import { Link } from 'react-router-dom'

import RelatorioResultado from '../components/RelatorioResultado'
import { useEntregas } from '../contexts/EntregasContext'

import '../styles/Relatorios.css'

function RelatorioEntregas() {
  const {
    entregas,
    carregando,
    erro,
  } = useEntregas()

  const [clienteSelecionado, setClienteSelecionado] =
    useState('')

  const [statusSelecionado, setStatusSelecionado] =
    useState('')

  const [dataSelecionada, setDataSelecionada] =
    useState('')

  const [resultados, setResultados] = useState([])
  const [mensagem, setMensagem] = useState('')

  const [relatorioGerado, setRelatorioGerado] =
    useState(false)

  const clientes = [
    ...new Set(
      entregas
        .map((entrega) => entrega.cliente)
        .filter(Boolean)
    ),
  ].sort((clienteA, clienteB) =>
    clienteA.localeCompare(clienteB, 'pt-BR')
  )

  const statusEntregas = [
    ...new Set(
      entregas
        .map((entrega) => entrega.status)
        .filter(Boolean)
    ),
  ].sort((statusA, statusB) =>
    statusA.localeCompare(statusB, 'pt-BR')
  )

  const datas = [
    ...new Set(
      entregas
        .map((entrega) => entrega.data)
        .filter(Boolean)
    ),
  ].sort((dataA, dataB) => {
    const [diaA, mesA, anoA] = dataA.split('/')
    const [diaB, mesB, anoB] = dataB.split('/')

    const valorA = `${anoA}${mesA}${diaA}`
    const valorB = `${anoB}${mesB}${diaB}`

    return valorB.localeCompare(valorA)
  })

  const colunas = [
    {
      chave: 'codigo',
      titulo: 'Código',
    },
    {
      chave: 'cliente',
      titulo: 'Cliente',
    },
    {
      chave: 'data',
      titulo: 'Data',
    },
    {
      chave: 'endereco',
      titulo: 'Endereço',
    },
    {
      chave: 'status',
      titulo: 'Status',
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

  function handleDataChange(event) {
    setDataSelecionada(event.target.value)
    limparResultadoAnterior()
  }

  function handleSubmit(event) {
    event.preventDefault()

    const entregasFiltradas = entregas.filter(
      (entrega) => {
        const correspondeCliente =
          !clienteSelecionado ||
          entrega.cliente === clienteSelecionado

        const correspondeStatus =
          !statusSelecionado ||
          entrega.status === statusSelecionado

        const correspondeData =
          !dataSelecionada ||
          entrega.data === dataSelecionada

        return (
          correspondeCliente &&
          correspondeStatus &&
          correspondeData
        )
      }
    )

    if (entregasFiltradas.length === 0) {
      setMensagem(
        'Nenhuma entrega encontrada para os filtros selecionados.'
      )
      setResultados([])
      setRelatorioGerado(false)
      return
    }

    setResultados(entregasFiltradas)
    setMensagem('')
    setRelatorioGerado(true)
  }

  if (carregando) {
    return (
      <main className="relatorio-page">
        <section className="relatorio-cabecalho">
          <h1>Relatório Entregas</h1>

          <p>
            Carregando dados das entregas...
          </p>
        </section>
      </main>
    )
  }

  if (erro) {
    return (
      <main className="relatorio-page">
        <section className="relatorio-cabecalho">
          <h1>Relatório Entregas</h1>
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
          titulo="Relatório de Entregas"
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
        <h1>Relatório Entregas</h1>

        <p>
          Defina os parâmetros para gerar o relatório
          de entregas.
        </p>
      </section>

      <section className="relatorio-conteudo">
        <form
          className="relatorio-form"
          onSubmit={handleSubmit}
        >
          <div className="relatorio-campo">
            <label htmlFor="relatorio-entrega-cliente">
              Cliente
            </label>

            <select
              id="relatorio-entrega-cliente"
              value={clienteSelecionado}
              onChange={handleClienteChange}
              disabled={entregas.length === 0}
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
            <label htmlFor="relatorio-entrega-status">
              Status
            </label>

            <select
              id="relatorio-entrega-status"
              value={statusSelecionado}
              onChange={handleStatusChange}
              disabled={entregas.length === 0}
            >
              <option value="">
                Todos os status
              </option>

              {statusEntregas.map((status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="relatorio-campo">
            <label htmlFor="relatorio-entrega-data">
              Data
            </label>

            <select
              id="relatorio-entrega-data"
              value={dataSelecionada}
              onChange={handleDataChange}
              disabled={entregas.length === 0}
            >
              <option value="">
                Todas as datas
              </option>

              {datas.map((data) => (
                <option
                  key={data}
                  value={data}
                >
                  {data}
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
            disabled={entregas.length === 0}
          >
            Gerar Relatório
          </button>
        </form>

        {entregas.length === 0 && (
          <div
            className="relatorio-alerta"
            role="status"
          >
            Nenhuma entrega cadastrada.
          </div>
        )}

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

export default RelatorioEntregas