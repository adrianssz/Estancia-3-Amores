import { Link, useParams } from 'react-router-dom'

import plantios from '../data/plantios'
import '../styles/ExcluirPlantio.css'

function ExcluirPlantio() {
  const { id } = useParams()

  const plantioSelecionado = plantios.find(
    (plantio) => plantio.id === Number(id)
  )

  if (!plantioSelecionado) {
    return (
      <section className="excluir-plantio-page">
        <h1 className="excluir-plantio-page__title">
          Plantio não encontrado
        </h1>

        <div className="excluir-plantio-form__acoes">
          <Link
            to="/plantios"
            className="excluir-plantio-form__retornar"
          >
            Retornar a Plantios
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="excluir-plantio-page">
      <h1 className="excluir-plantio-page__title">
        Excluir
      </h1>

      <div className="excluir-plantio-form">
        <div className="excluir-plantio-form__grupo">
          <label htmlFor="plantio">
            Plantio
          </label>

          <input
            id="plantio"
            type="text"
            value={plantioSelecionado.nome}
            readOnly
          />
        </div>

        <div className="excluir-plantio-form__grupo">
          <label htmlFor="tipoPlanta">
            Tipo de Planta
          </label>

          <input
            id="tipoPlanta"
            type="text"
            value={plantioSelecionado.tipo}
            readOnly
          />
        </div>

        <div className="excluir-plantio-form__grupo">
          <label htmlFor="area">
            Área
          </label>

          <input
            id="area"
            type="text"
            value={plantioSelecionado.area}
            readOnly
          />
        </div>

        <div className="excluir-plantio-form__grupo">
          <label htmlFor="quantidade">
            Quantidade
          </label>

          <input
            id="quantidade"
            type="text"
            value={plantioSelecionado.quantidade}
            readOnly
          />
        </div>

        <div className="excluir-plantio-form__acoes">
          <button
            type="button"
            className="excluir-plantio-form__excluir"
          >
            Excluir
          </button>

          <Link
            to="/plantios"
            className="excluir-plantio-form__retornar"
          >
            Retornar a Plantios
          </Link>
        </div>
      </div>
    </section>
  )
}

export default ExcluirPlantio