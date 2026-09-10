import { useState } from 'react'

import {
  Link,
  useParams,
} from 'react-router-dom'

import { useEntregas } from '../contexts/EntregasContext'
import '../styles/ExcluirEntrega.css'


function FormularioExcluirEntrega({
  entregaSelecionada,
  excluirEntrega,
}) {
  const [entrega] = useState(
    entregaSelecionada
  )

  const [
    excluidaComSucesso,
    setExcluidaComSucesso,
  ] = useState(false)

  const [excluindo, setExcluindo] = useState(false)
  const [erro, setErro] = useState('')


  if (!entrega) {
    return (
      <section className="excluir-entrega-page">

        <h1 className="excluir-entrega-page__title">
          Entrega não encontrada
        </h1>

        <div className="excluir-entrega-form__acoes">

          <Link
            to="/entregas"
            className="excluir-entrega-form__retornar"
          >
            Retornar a Entregas
          </Link>

        </div>

      </section>
    )
  }


  async function handleExcluir() {
    setErro('')
    setExcluindo(true)

    const resultado = await excluirEntrega(
      entrega.codigo
    )

    setExcluindo(false)

    if (!resultado.sucesso) {
      setErro(resultado.mensagem)
      return
    }

    setExcluidaComSucesso(true)
  }


  return (
    <section className="excluir-entrega-page">

      <h1 className="excluir-entrega-page__title">
        Excluir
      </h1>


      <div className="excluir-entrega-form">

        <div className="excluir-entrega-form__grupo">

          <label htmlFor="nome">
            Nome
          </label>

          <input
            id="nome"
            type="text"
            value={entrega.cliente}
            readOnly
            disabled={excluidaComSucesso}
          />

        </div>


        <div className="excluir-entrega-form__grupo">

          <label htmlFor="endereco">
            Endereço
          </label>

          <input
            id="endereco"
            type="text"
            value={entrega.endereco}
            readOnly
            disabled={excluidaComSucesso}
          />

        </div>


        <div className="excluir-entrega-form__grupo">

          <label htmlFor="data">
            Data
          </label>

          <input
            id="data"
            type="text"
            value={entrega.data}
            readOnly
            disabled={excluidaComSucesso}
          />

        </div>


        {erro && (
          <div
            className="excluir-entrega-alert"
            role="alert"
          >
            {erro}
          </div>
        )}


        {excluidaComSucesso && (
          <div
            className="excluir-entrega-alert"
            role="alert"
          >
            Entrega excluída! Clique em
            {' '}
            &apos;Retornar a Entregas&apos;
            {' '}
            para retornar.
          </div>
        )}


        <div className="excluir-entrega-form__acoes">

          {!excluidaComSucesso && (
            <button
              type="button"
              className="excluir-entrega-form__excluir"
              onClick={handleExcluir}
              disabled={excluindo}
            >
              {excluindo
                ? 'Excluindo...'
                : 'Excluir'}
            </button>
          )}


          <Link
            to="/entregas"
            className="excluir-entrega-form__retornar"
          >
            Retornar a Entregas
          </Link>

        </div>

      </div>

    </section>
  )
}


function ExcluirEntrega() {
  const { codigo } = useParams()

  const {
    entregas,
    carregando,
    erro: erroEntregas,
    excluirEntrega,
  } = useEntregas()


  const entregaSelecionada = entregas.find(
    (entrega) =>
      entrega.codigo === Number(codigo)
  )


  if (carregando) {
    return (
      <section className="excluir-entrega-page">

        <h1 className="excluir-entrega-page__title">
          Carregando...
        </h1>

      </section>
    )
  }


  if (erroEntregas) {
    return (
      <section className="excluir-entrega-page">

        <h1 className="excluir-entrega-page__title">
          Erro ao carregar entrega
        </h1>

        <div
          className="excluir-entrega-alert"
          role="alert"
        >
          {erroEntregas}
        </div>

        <div className="excluir-entrega-form__acoes">

          <Link
            to="/entregas"
            className="excluir-entrega-form__retornar"
          >
            Retornar a Entregas
          </Link>

        </div>

      </section>
    )
  }


  return (
    <FormularioExcluirEntrega
      key={codigo}
      entregaSelecionada={entregaSelecionada}
      excluirEntrega={excluirEntrega}
    />
  )
}


export default ExcluirEntrega