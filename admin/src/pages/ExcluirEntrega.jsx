import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { useEntregas } from '../contexts/EntregasContext'
import '../styles/ExcluirEntrega.css'

function ExcluirEntrega() {
  const { codigo } = useParams()

  const {
    entregas,
    excluirEntrega,
  } = useEntregas()

  const entregaInicial = entregas.find(
    (entrega) => entrega.codigo === Number(codigo)
  )

  const [entregaExibida] = useState(entregaInicial)

  const [excluidaComSucesso, setExcluidaComSucesso] =
    useState(false)

  function handleExcluir() {
    excluirEntrega(Number(codigo))
    setExcluidaComSucesso(true)
  }

  if (!entregaExibida) {
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
            value={entregaExibida.cliente}
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
            value={entregaExibida.endereco}
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
            value={entregaExibida.data}
            readOnly
            disabled={excluidaComSucesso}
          />
        </div>

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
            >
              Excluir
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

export default ExcluirEntrega