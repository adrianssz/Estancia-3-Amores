import { useState } from 'react'
import { Link } from 'react-router-dom'

import { usePlantios } from '../contexts/PlantiosContext'
import '../styles/AdicionarPlantio.css'

function AdicionarPlantio() {
  const {
    plantios,
    adicionarPlantio,
  } = usePlantios()

  const [plantio, setPlantio] = useState('')
  const [tipoPlanta, setTipoPlanta] = useState('')
  const [area, setArea] = useState('')
  const [quantidade, setQuantidade] = useState('')

  const [adicionadoComSucesso, setAdicionadoComSucesso] =
    useState(false)

  function handleSubmit(event) {
    event.preventDefault()

    const maiorId = plantios.reduce(
      (maior, item) =>
        item.id > maior
          ? item.id
          : maior,
      0
    )

    const novoPlantio = {
      id: maiorId + 1,
      nome: plantio.trim(),
      tipo: tipoPlanta.trim(),
      area: Number(area),
      quantidade: Number(quantidade),
    }

    adicionarPlantio(novoPlantio)

    setAdicionadoComSucesso(true)
  }

  function handleNovoPlantio() {
    setPlantio('')
    setTipoPlanta('')
    setArea('')
    setQuantidade('')
    setAdicionadoComSucesso(false)
  }

  return (
    <section className="adicionar-plantio-page">
      <h1 className="adicionar-plantio-page__title">
        Adicionar
      </h1>

      <form
        className="adicionar-plantio-form"
        onSubmit={handleSubmit}
      >
        <div className="adicionar-plantio-form__grupo">
          <label htmlFor="plantio">
            Plantio
          </label>

          <input
            id="plantio"
            type="text"
            value={plantio}
            onChange={(event) =>
              setPlantio(event.target.value)
            }
            placeholder="Digite o nome do plantio"
            disabled={adicionadoComSucesso}
            required
          />
        </div>

        <div className="adicionar-plantio-form__grupo">
          <label htmlFor="tipoPlanta">
            Tipo de Planta
          </label>

          <input
            id="tipoPlanta"
            type="text"
            value={tipoPlanta}
            onChange={(event) =>
              setTipoPlanta(event.target.value)
            }
            placeholder="Ex: Fruta"
            disabled={adicionadoComSucesso}
            required
          />
        </div>

        <div className="adicionar-plantio-form__grupo">
          <label htmlFor="area">
            Área
          </label>

          <input
            id="area"
            type="number"
            min="1"
            value={area}
            onChange={(event) =>
              setArea(event.target.value)
            }
            placeholder="Ex: 18"
            disabled={adicionadoComSucesso}
            required
          />
        </div>

        <div className="adicionar-plantio-form__grupo">
          <label htmlFor="quantidade">
            Quantidade
          </label>

          <input
            id="quantidade"
            type="number"
            min="1"
            step="1"
            value={quantidade}
            onChange={(event) =>
              setQuantidade(event.target.value)
            }
            placeholder="Ex: 250"
            disabled={adicionadoComSucesso}
            required
          />
        </div>

        {adicionadoComSucesso && (
          <div
            className="adicionar-plantio-alert"
            role="alert"
          >
            Plantio adicionado! Clique em
            {' '}
            &apos;Retornar a Plantios&apos;
            {' '}
            para retornar, ou
            {' '}
            &apos;+ Adicionar Plantio&apos;
            {' '}
            para cadastrar um novo plantio.
          </div>
        )}

        <div className="adicionar-plantio-form__acoes">
          {!adicionadoComSucesso && (
            <button
              type="submit"
              className="adicionar-plantio-form__adicionar"
            >
              + Adicionar Plantio
            </button>
          )}

          {adicionadoComSucesso && (
            <button
              type="button"
              className="adicionar-plantio-form__adicionar"
              onClick={handleNovoPlantio}
            >
              + Adicionar Plantio
            </button>
          )}

          <Link
            to="/plantios"
            className="adicionar-plantio-form__retornar"
          >
            Retornar a Plantios
          </Link>
        </div>
      </form>
    </section>
  )
}

export default AdicionarPlantio