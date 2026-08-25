import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { usePlantios } from '../contexts/PlantiosContext'
import '../styles/AdicionarPlantio.css'

function AdicionarPlantio() {
  const navigate = useNavigate()

  const {
    plantios,
    adicionarPlantio,
  } = usePlantios()

  const [plantio, setPlantio] = useState('')
  const [tipoPlanta, setTipoPlanta] = useState('')
  const [area, setArea] = useState('')
  const [quantidade, setQuantidade] = useState('')

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

    navigate('/plantios')
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
            required
          />
        </div>

        <div className="adicionar-plantio-form__acoes">
          <button
            type="submit"
            className="adicionar-plantio-form__adicionar"
          >
            + Adicionar Plantio
          </button>

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