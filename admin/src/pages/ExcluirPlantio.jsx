import { useState } from 'react'

import {
  Link,
  useParams,
} from 'react-router-dom'

import { usePlantios } from '../contexts/PlantiosContext'
import '../styles/ExcluirPlantio.css'


function FormularioExcluirPlantio({
  plantioSelecionado,
  id,
  excluirPlantio,
}) {
  const [plantio] = useState(plantioSelecionado)

  const [
    excluidoComSucesso,
    setExcluidoComSucesso,
  ] = useState(false)

  const [excluindo, setExcluindo] = useState(false)
  const [erro, setErro] = useState('')


  if (!plantio) {
    return (
      <section className="excluir-plantio-page">

        <h1 className="excluir-plantio-page__title">
          Registro não encontrado
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


  async function handleExcluir() {
    setErro('')
    setExcluindo(true)

    const resultado = await excluirPlantio(
      Number(id)
    )

    setExcluindo(false)

    if (!resultado.sucesso) {
      setErro(resultado.mensagem)
      return
    }

    setExcluidoComSucesso(true)
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
            value={plantio.nome}
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
            value={plantio.tipo}
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
            value={plantio.area}
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
            value={plantio.quantidade}
            readOnly
          />

        </div>


        {erro && (

          <div
            className="excluir-plantio-alert"
            role="alert"
          >
            {erro}
          </div>

        )}


        {excluidoComSucesso && (

          <div
            className="excluir-plantio-alert"
            role="alert"
          >
            Plantio excluído! Clique em
            {' '}
            &apos;Retornar a Plantios&apos;
            {' '}
            para retornar.
          </div>

        )}


        <div className="excluir-plantio-form__acoes">

          {!excluidoComSucesso && (

            <button
              type="button"
              className="excluir-plantio-form__excluir"
              onClick={handleExcluir}
              disabled={excluindo}
            >
              {excluindo
                ? 'Excluindo...'
                : 'Excluir'}
            </button>

          )}


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


function ExcluirPlantio() {
  const { id } = useParams()

  const {
    plantios,
    carregando,
    erro: erroCarregamento,
    excluirPlantio,
  } = usePlantios()

  const plantioSelecionado = plantios.find(
    (plantio) =>
      plantio.id === Number(id)
  )


  if (carregando) {
    return (
      <section className="excluir-plantio-page">

        <h1 className="excluir-plantio-page__title">
          Carregando...
        </h1>

      </section>
    )
  }


  if (erroCarregamento) {
    return (
      <section className="excluir-plantio-page">

        <h1 className="excluir-plantio-page__title">
          Erro ao carregar plantio
        </h1>

        <div
          className="excluir-plantio-alert"
          role="alert"
        >
          {erroCarregamento}
        </div>

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
    <FormularioExcluirPlantio
      key={id}
      plantioSelecionado={plantioSelecionado}
      id={id}
      excluirPlantio={excluirPlantio}
    />
  )
}


export default ExcluirPlantio