import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { usePedidos } from '../contexts/PedidosContext'
import '../styles/EditarPedido.css'

function EditarPedido() {
  const { id } = useParams()

  const {
    pedidos,
    editarPedido,
  } = usePedidos()

  const pedidoSelecionado = pedidos.find(
    (pedido) => pedido.id === Number(id)
  )

  const [cliente, setCliente] = useState(
    pedidoSelecionado?.cliente ?? ''
  )

  const [telefone, setTelefone] = useState(
    pedidoSelecionado?.telefone ?? ''
  )

  const [status, setStatus] = useState(
    pedidoSelecionado?.status ?? 'Pendente'
  )

  const [data, setData] = useState(
    pedidoSelecionado?.data ?? ''
  )

  const [editadoComSucesso, setEditadoComSucesso] =
    useState(false)

  const [erroData, setErroData] = useState(false)

  function formatarTelefone(valor) {
    const numeros = valor
      .replace(/\D/g, '')
      .slice(0, 11)

    if (numeros.length <= 2) {
      return numeros
    }

    if (numeros.length <= 7) {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`
    }

    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`
  }

  function formatarData(valor) {
    const numeros = valor
      .replace(/\D/g, '')
      .slice(0, 8)

    if (numeros.length <= 2) {
      return numeros
    }

    if (numeros.length <= 4) {
      return `${numeros.slice(0, 2)}/${numeros.slice(2)}`
    }

    return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4)}`
  }

  function dataValida(valor) {
    const formatoCorreto =
      /^\d{2}\/\d{2}\/\d{4}$/.test(valor)

    if (!formatoCorreto) {
      return false
    }

    const [dia, mes, ano] = valor
      .split('/')
      .map(Number)

    const dataInformada = new Date(
      ano,
      mes - 1,
      dia
    )

    const dataExiste =
      dataInformada.getFullYear() === ano &&
      dataInformada.getMonth() === mes - 1 &&
      dataInformada.getDate() === dia

    if (!dataExiste) {
      return false
    }

    const hoje = new Date()

    hoje.setHours(0, 0, 0, 0)
    dataInformada.setHours(0, 0, 0, 0)

    return dataInformada <= hoje
  }

  function handleTelefoneChange(event) {
    setTelefone(
      formatarTelefone(event.target.value)
    )
  }

  function handleDataChange(event) {
    setData(
      formatarData(event.target.value)
    )

    setErroData(false)
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!dataValida(data)) {
      setErroData(true)
      return
    }

    editarPedido(
      Number(id),
      {
        cliente: cliente.trim(),
        telefone,
        status,
        data,
      }
    )

    setErroData(false)
    setEditadoComSucesso(true)
  }

  function handleEditarNovamente() {
    setEditadoComSucesso(false)
  }

  if (!pedidoSelecionado) {
    return (
      <section className="editar-pedido-page">
        <h1 className="editar-pedido-page__title">
          Pedido não encontrado
        </h1>

        <div className="editar-pedido-form__acoes">
          <Link
            to="/pedidos"
            className="editar-pedido-form__retornar"
          >
            Retornar a Pedidos
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="editar-pedido-page">
      <h1 className="editar-pedido-page__title">
        Editar
      </h1>

      <form
        className="editar-pedido-form"
        onSubmit={handleSubmit}
      >
        <div className="editar-pedido-form__grupo">
          <label htmlFor="cliente">
            Cliente
          </label>

          <input
            id="cliente"
            type="text"
            minLength="3"
            value={cliente}
            onChange={(event) =>
              setCliente(event.target.value)
            }
            disabled={editadoComSucesso}
            required
          />
        </div>

        <div className="editar-pedido-form__grupo">
          <label htmlFor="telefone">
            Telefone
          </label>

          <input
            id="telefone"
            type="tel"
            value={telefone}
            onChange={handleTelefoneChange}
            disabled={editadoComSucesso}
            required
          />
        </div>

        <div className="editar-pedido-form__grupo">
          <label htmlFor="status">
            Status
          </label>

          <select
            id="status"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
            disabled={editadoComSucesso}
            required
          >
            <option value="Pendente">
              Pendente
            </option>

            <option value="Em Rota">
              Em Rota
            </option>

            <option value="Entregue">
              Entregue
            </option>
          </select>
        </div>

        <div className="editar-pedido-form__grupo">
          <label htmlFor="data">
            Data
          </label>

          <input
            id="data"
            type="text"
            value={data}
            onChange={handleDataChange}
            placeholder="DD/MM/AAAA"
            maxLength="10"
            disabled={editadoComSucesso}
            required
          />

          {erroData && (
            <p className="editar-pedido-form__erro">
              Data inválida! Por favor, corrija.
            </p>
          )}
        </div>

        {editadoComSucesso && (
          <div
            className="editar-pedido-alert"
            role="alert"
          >
            Pedido editado! Clique em
            {' '}
            &apos;Retornar a Pedidos&apos;
            {' '}
            para retornar, ou
            {' '}
            &apos;+ Editar Pedido&apos;
            {' '}
            para editar novamente.
          </div>
        )}

        <div className="editar-pedido-form__acoes">
          {!editadoComSucesso && (
            <button
              type="submit"
              className="editar-pedido-form__salvar"
            >
              Salvar alterações
            </button>
          )}

          {editadoComSucesso && (
            <button
              type="button"
              className="editar-pedido-form__salvar"
              onClick={handleEditarNovamente}
            >
              + Editar Pedido
            </button>
          )}

          <Link
            to="/pedidos"
            className="editar-pedido-form__retornar"
          >
            Retornar a Pedidos
          </Link>
        </div>
      </form>
    </section>
  )
}

export default EditarPedido