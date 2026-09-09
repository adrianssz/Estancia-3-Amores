import { useState } from 'react'
import { Link } from 'react-router-dom'

import RelatorioResultado from '../components/RelatorioResultado'
import { usePlantios } from '../contexts/PlantiosContext'

import '../styles/Relatorios.css'

function RelatorioPlantios() {
  const {
    plantios,
    carregando,
    erro,
  } = usePlantios()

  const [plantioSelecionado, setPlantioSelecionado] =
    useState('')

  const [areaSelecionada, setAreaSelecionada] =
    useState('')

  const [resultados, setResultados] = useState([])
  const [mensagem, setMensagem] = useState('')

  const [relatorioGerado, setRelatorioGerado] =
    useState(false)

  const nomesPlantios = [
    ...new Set(
      plantios
        .map((plantio) => plantio.nome)
        .filter(Boolean)
    ),
  ].sort((nomeA, nomeB) =>
    nomeA.localeCompare(nomeB, 'pt-BR')
  )

  const areas = [
    ...new Set(
      plantios
        .map((plantio) => plantio.area)
        .filter(
          (area) =>
            area !== undefined &&
            area !== null &&
            area !== ''
        )
        .map(String)
    ),
  ].sort((areaA, areaB) =>
    areaA.localeCompare(areaB, 'pt-BR', {
      numeric: true,
    })
  )

  const colunas = [
    {
      chave: 'nome',
      titulo: 'Plantio',
    },
    {
      chave: 'tipo',
      titulo: 'Tipo de Planta',
    },
    {
      chave: 'area',
      titulo: 'Área',
    },
    {
      chave: 'quantidade',
      titulo: 'Quantidade',
    },
  ]

  function limparResultadoAnterior() {
    setResultados([])
    setMensagem('')
    setRelatorioGerado(false)
  }

  function handlePlantioChange(event) {
    setPlantioSelecionado(event.target.value)
    limparResultadoAnterior()
  }

  function handleAreaChange(event) {
    setAreaSelecionada(event.target.value)
    limparResultadoAnterior()
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!plantioSelecionado || !areaSelecionada) {
      setMensagem(
        'Selecione Plantio e Área para gerar o relatório.'
      )
      setResultados([])
      setRelatorioGerado(false)
      return
    }

    const plantiosFiltrados = plantios.filter(
      (plantio) =>
        plantio.nome === plantioSelecionado &&
        String(plantio.area) === areaSelecionada
    )

    if (plantiosFiltrados.length === 0) {
      setMensagem(
        'Não existem dados para os filtros selecionados.'
      )
      setResultados([])
      setRelatorioGerado(false)
      return
    }

    setResultados(plantiosFiltrados)
    setMensagem('')
    setRelatorioGerado(true)
  }

  if (carregando) {
    return (
      <main className="relatorio-page">
        <section className="relatorio-cabecalho">
          <h1>Relatório Plantios</h1>

          <p>Carregando dados dos plantios...</p>
        </section>
      </main>
    )
  }

  if (erro) {
    return (
      <main className="relatorio-page">
        <section className="relatorio-cabecalho">
          <h1>Relatório Plantios</h1>
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
          titulo="Relatório de Plantios"
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
        <h1>Relatório Plantios</h1>

        <p>
          Defina os parâmetros para gerar o relatório
          de plantios.
        </p>
      </section>

      <section className="relatorio-conteudo">
        <form
          className="relatorio-form"
          onSubmit={handleSubmit}
        >
          <div className="relatorio-campo">
            <label htmlFor="relatorio-plantio">
              Plantio
            </label>

            <select
              id="relatorio-plantio"
              value={plantioSelecionado}
              onChange={handlePlantioChange}
              disabled={nomesPlantios.length === 0}
            >
              <option value="">
                {nomesPlantios.length === 0
                  ? 'Nenhum plantio encontrado'
                  : 'Selecione um plantio'}
              </option>

              {nomesPlantios.map((nome) => (
                <option
                  key={nome}
                  value={nome}
                >
                  {nome}
                </option>
              ))}
            </select>
          </div>

          <div className="relatorio-campo">
            <label htmlFor="relatorio-area">
              Área
            </label>

            <select
              id="relatorio-area"
              value={areaSelecionada}
              onChange={handleAreaChange}
              disabled={areas.length === 0}
            >
              <option value="">
                {areas.length === 0
                  ? 'Nenhuma área encontrada'
                  : 'Selecione uma área'}
              </option>

              {areas.map((area) => (
                <option
                  key={area}
                  value={area}
                >
                  {area}
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
            disabled={
              nomesPlantios.length === 0 ||
              areas.length === 0
            }
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

export default RelatorioPlantios