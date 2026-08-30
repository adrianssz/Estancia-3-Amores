import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { usePedidos } from '../contexts/PedidosContext'
import '../styles/ExcluirPedido.css'

function ExcluirPedido() {
  const { id } = useParams()

  const {
    pedidos,
    excluirPedido,
  } = usePedidos()

  const pedidoInicial = pedidos.find(
    (pedido) => pedido.id === Number(id)
  )

  const [pedidoExibido] = useState(pedidoInicial)

  const [excluidoComSucesso, setExcluidoComSucesso] =
    useState(false)

  function handleExcluir() {
    excluirPedido(Number(id))
    setExcluidoComSucesso(true)
  }

  if (!pedidoExibido) {
    return (
      <section className="excluir-pedido-page">
        <h1 className="excluir-pedido-page__title">
          Pedido não encontrado
        </h1>

        <div className="excluir-pedido-form__acoes">
          <Link
            to="/pedidos"
            className="excluir-pedido-form__retornar"
          >
            Retornar a Pedidos
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="excluir-pedido-page">
      <h1 className="excluir-pedido-page__title">
        Excluir
      </h1>

      <div className="excluir-pedido-form">
        <div className="excluir-pedido-form__grupo">
          <label htmlFor="cliente">
            Cliente
          </label>

          <input
            id="cliente"
            type="text"
            value={pedidoExibido.cliente}
            readOnly
            disabled={excluidoComSucesso}
          />
        </div>

        <div className="excluir-pedido-form__grupo">
          <label htmlFor="telefone">
            Telefone
          </label>

          <input
            id="telefone"
            type="text"
            value={pedidoExibido.telefone}
            readOnly
            disabled={excluidoComSucesso}
          />
        </div>

        <div className="excluir-pedido-form__grupo">
          <label htmlFor="status">
            Status
          </label>

          <input
            id="status"
            type="text"
            value={pedidoExibido.status}
            readOnly
            disabled={excluidoComSucesso}
          />
        </div>

        <div className="excluir-pedido-form__grupo">
          <label htmlFor="data">
            Data
          </label>

          <input
            id="data"
            type="text"
            value={pedidoExibido.data}
            readOnly
            disabled={excluidoComSucesso}
          />
        </div>

        {excluidoComSucesso && (
          <div
            className="excluir-pedido-alert"
            role="alert"
          >
            Pedido excluído! Clique em
            {' '}
            &apos;Retornar a Pedidos&apos;
            {' '}
            para retornar.
          </div>
        )}

        <div className="excluir-pedido-form__acoes">
          {!excluidoComSucesso && (
            <button
              type="button"
              className="excluir-pedido-form__excluir"
              onClick={handleExcluir}
            >
              Excluir
            </button>
          )}

          <Link
            to="/pedidos"
            className="excluir-pedido-form__retornar"
          >
            Retornar a Pedidos
          </Link>
        </div>
      </div>
    </section>
  )
}

export default ExcluirPedido