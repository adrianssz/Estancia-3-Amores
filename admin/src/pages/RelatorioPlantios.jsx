import { useState } from 'react'
import { Link } from 'react-router-dom'

import RelatorioResultado from '../components/RelatorioResultado'
import { usePlantios } from '../contexts/PlantiosContext'

import '../styles/Relatorios.css'

function RelatorioPlantios() {
  const { plantios } = usePlantios()

  const [plantioSelecionado, setPlantioSelecionado] =
    useState('')
  const [areaSelecionada, setAreaSelecionada] =
    useState('')
  const [resultados, setResultados] = useState([])
  const [mensagem, setMensagem] = useState('')
  const [relatorioGerado, setRelatorioGerado] =
    useState(false)

  const dadosDisponiveis = Array.isArray(plantios)

  const nomesPlantios = dadosDisponiveis
    ? [
        ...new Set(
          plantios
            .map((plantio) => plantio.nome)
            .filter(Boolean)
        ),
      ].sort((nomeA, nomeB) =>
        nomeA.localeCompare(nomeB, 'pt-BR')
      )
    : []

  const areas = dadosDisponiveis
    ? [
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
    : []

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

    if (!dadosDisponiveis) {
      setMensagem('Erro ao carregar opções')
      setResultados([])
      setRelatorioGerado(false)
      return
    }

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
        {!dadosDisponiveis && (
          <div
            className="relatorio-alerta"
            role="alert"
          >
            Erro ao carregar opções
          </div>
        )}

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
              disabled={
                !dadosDisponiveis ||
                nomesPlantios.length === 0
              }
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
              disabled={
                !dadosDisponiveis ||
                areas.length === 0
              }
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
              !dadosDisponiveis ||
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