import { useState } from 'react'
import { Link } from 'react-router-dom'

import { usePedidos } from '../contexts/PedidosContext'
import '../styles/AdicionarPedido.css'

function AdicionarPedido() {
  const {
    pedidos,
    adicionarPedido,
  } = usePedidos()

  const [cliente, setCliente] = useState('')
  const [telefone, setTelefone] = useState('')
  const [status, setStatus] = useState('Pendente')
  const [data, setData] = useState('')

  const [adicionadoComSucesso, setAdicionadoComSucesso] =
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

    const maiorId = pedidos.reduce(
      (maior, pedido) =>
        pedido.id > maior
          ? pedido.id
          : maior,
      0
    )

    const novoPedido = {
      id: maiorId + 1,
      cliente: cliente.trim(),
      telefone,
      status,
      data,
    }

    adicionarPedido(novoPedido)

    setErroData(false)
    setAdicionadoComSucesso(true)
  }

  function handleNovoPedido() {
    setCliente('')
    setTelefone('')
    setStatus('Pendente')
    setData('')
    setErroData(false)
    setAdicionadoComSucesso(false)
  }

  return (
    <section className="adicionar-pedido-page">
      <h1 className="adicionar-pedido-page__title">
        Adicionar
      </h1>

      <form
        className="adicionar-pedido-form"
        onSubmit={handleSubmit}
      >
        <div className="adicionar-pedido-form__grupo">
          <label htmlFor="cliente">
            Cliente
          </label>

          <input
            id="cliente"
            type="text"
            value={cliente}
            onChange={(event) =>
              setCliente(event.target.value)
            }
            disabled={adicionadoComSucesso}
            required
          />
        </div>

        <div className="adicionar-pedido-form__grupo">
          <label htmlFor="telefone">
            Telefone
          </label>

          <input
            id="telefone"
            type="tel"
            value={telefone}
            onChange={handleTelefoneChange}
            placeholder="(44) 99999-9999"
            disabled={adicionadoComSucesso}
            required
          />
        </div>

        <div className="adicionar-pedido-form__grupo">
          <label htmlFor="status">
            Status
          </label>

          <select
            id="status"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
            disabled={adicionadoComSucesso}
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

        <div className="adicionar-pedido-form__grupo">
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
            disabled={adicionadoComSucesso}
            required
          />

          {erroData && (
            <p className="adicionar-pedido-form__erro">
              Data inválida! Por favor, corrija.
            </p>
          )}
        </div>

        {adicionadoComSucesso && (
          <div
            className="adicionar-pedido-alert"
            role="alert"
          >
            Pedido adicionado! Clique em
            {' '}
            &apos;Retornar a Pedidos&apos;
            {' '}
            para retornar, ou
            {' '}
            &apos;+ Adicionar Pedido&apos;
            {' '}
            para cadastrar um novo pedido.
          </div>
        )}

        <div className="adicionar-pedido-form__acoes">
          {!adicionadoComSucesso && (
            <button
              type="submit"
              className="adicionar-pedido-form__adicionar"
            >
              + Adicionar Pedido
            </button>
          )}

          {adicionadoComSucesso && (
            <button
              type="button"
              className="adicionar-pedido-form__adicionar"
              onClick={handleNovoPedido}
            >
              + Adicionar Pedido
            </button>
          )}

          <Link
            to="/pedidos"
            className="adicionar-pedido-form__retornar"
          >
            Retornar a Pedidos
          </Link>
        </div>
      </form>
    </section>
  )
}

export default AdicionarPedido