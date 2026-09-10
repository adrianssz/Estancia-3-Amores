import { useState } from 'react'

import {
  Link,
  useParams,
} from 'react-router-dom'

import { usePedidos } from '../contexts/PedidosContext'
import '../styles/ExcluirPedido.css'


function FormularioExcluirPedido({
  pedidoSelecionado,
  excluirPedido,
}) {
  const [pedido] = useState(
    pedidoSelecionado
  )

  const [
    excluidoComSucesso,
    setExcluidoComSucesso,
  ] = useState(false)

  const [excluindo, setExcluindo] = useState(false)
  const [erro, setErro] = useState('')


  if (!pedido) {
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


  async function handleExcluir() {
    setErro('')
    setExcluindo(true)

    const resultado = await excluirPedido(
      pedido.id
    )

    setExcluindo(false)

    if (!resultado.sucesso) {
      setErro(resultado.mensagem)
      return
    }

    setExcluidoComSucesso(true)
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
            value={pedido.cliente}
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
            value={pedido.telefone}
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
            value={pedido.status}
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
            value={pedido.data}
            readOnly
            disabled={excluidoComSucesso}
          />

        </div>


        {erro && (

          <div
            className="excluir-pedido-alert"
            role="alert"
          >
            {erro}
          </div>

        )}


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
              disabled={excluindo}
            >
              {excluindo
                ? 'Excluindo...'
                : 'Excluir'}
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


function ExcluirPedido() {
  const { id } = useParams()

  const {
    pedidos,
    carregando,
    erro: erroPedidos,
    excluirPedido,
  } = usePedidos()

  const pedidoSelecionado = pedidos.find(
    (pedido) =>
      pedido.id === Number(id)
  )


  if (carregando) {
    return (
      <section className="excluir-pedido-page">

        <h1 className="excluir-pedido-page__title">
          Carregando...
        </h1>

      </section>
    )
  }


  if (erroPedidos) {
    return (
      <section className="excluir-pedido-page">

        <h1 className="excluir-pedido-page__title">
          Erro ao carregar pedido
        </h1>

        <div
          className="excluir-pedido-alert"
          role="alert"
        >
          {erroPedidos}
        </div>

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
    <FormularioExcluirPedido
      key={id}
      pedidoSelecionado={pedidoSelecionado}
      excluirPedido={excluirPedido}
    />
  )
}


export default ExcluirPedido