import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import plantios from '../data/plantios'
import '../styles/EditarPlantio.css'

function EditarPlantio() {
  const { id } = useParams()

  const plantioSelecionado = plantios.find(
    (plantio) => plantio.id === Number(id)
  )

  const [nome, setNome] = useState(
    plantioSelecionado?.nome ?? ''
  )

  const [tipoPlanta, setTipoPlanta] = useState(
    plantioSelecionado?.tipo ?? ''
  )

  const [area, setArea] = useState(
    plantioSelecionado?.area ?? ''
  )

  const [quantidade, setQuantidade] = useState(
    plantioSelecionado?.quantidade ?? ''
  )

  function handleSubmit(event) {
    event.preventDefault()
  }

  if (!plantioSelecionado) {
    return (
      <section className="editar-plantio-page">
        <h1 className="editar-plantio-page__title">
          Plantio não encontrado
        </h1>

        <div className="editar-plantio-form__acoes">
          <Link
            to="/plantios"
            className="editar-plantio-form__retornar"
          >
            Retornar a Plantios
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="editar-plantio-page">
      <h1 className="editar-plantio-page__title">
        Editar
      </h1>

      <form
        className="editar-plantio-form"
        onSubmit={handleSubmit}
      >
        <div className="editar-plantio-form__grupo">
          <label htmlFor="plantio">
            Plantio
          </label>

          <input
            id="plantio"
            type="text"
            value={nome}
            onChange={(event) => setNome(event.target.value)}
            required
          />
        </div>

        <div className="editar-plantio-form__grupo">
          <label htmlFor="tipoPlanta">
            Tipo de Planta
          </label>

          <input
            id="tipoPlanta"
            type="text"
            value={tipoPlanta}
            onChange={(event) => setTipoPlanta(event.target.value)}
            required
          />
        </div>

        <div className="editar-plantio-form__grupo">
          <label htmlFor="area">
            Área
          </label>

          <input
            id="area"
            type="number"
            min="1"
            value={area}
            onChange={(event) => setArea(event.target.value)}
            required
          />
        </div>

        <div className="editar-plantio-form__grupo">
          <label htmlFor="quantidade">
            Quantidade
          </label>

          <input
            id="quantidade"
            type="number"
            min="1"
            step="1"
            value={quantidade}
            onChange={(event) => setQuantidade(event.target.value)}
            required
          />
        </div>

        <div className="editar-plantio-form__acoes">
          <button
            type="submit"
            className="editar-plantio-form__salvar"
          >
            Salvar alterações
          </button>

          <Link
            to="/plantios"
            className="editar-plantio-form__retornar"
          >
            Retornar a Plantios
          </Link>
        </div>
      </form>
    </section>
  )
}

export default EditarPlantio