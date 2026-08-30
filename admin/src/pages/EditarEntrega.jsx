import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { useEntregas } from '../contexts/EntregasContext'
import '../styles/EditarEntrega.css'

function EditarEntrega() {
  const { codigo } = useParams()

  const {
    entregas,
    editarEntrega,
  } = useEntregas()

  const entregaSelecionada = entregas.find(
    (entrega) => entrega.codigo === Number(codigo)
  )

  const [cliente, setCliente] = useState(
    entregaSelecionada?.cliente ?? ''
  )

  const [endereco, setEndereco] = useState(
    entregaSelecionada?.endereco ?? ''
  )

  const [data, setData] = useState(
    entregaSelecionada?.data ?? ''
  )

  const [status, setStatus] = useState(
    entregaSelecionada?.status ?? 'Pendente'
  )

  const [erroData, setErroData] = useState(false)

  const [editadaComSucesso, setEditadaComSucesso] =
    useState(false)

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

    return (
      dataInformada.getFullYear() === ano &&
      dataInformada.getMonth() === mes - 1 &&
      dataInformada.getDate() === dia
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

    editarEntrega(
      Number(codigo),
      {
        cliente: cliente.trim(),
        endereco: endereco.trim(),
        data,
        status,
      }
    )

    setErroData(false)
    setEditadaComSucesso(true)
  }

  function handleEditarNovamente() {
    setEditadaComSucesso(false)
  }

  if (!entregaSelecionada) {
    return (
      <section className="editar-entrega-page">
        <h1 className="editar-entrega-page__title">
          Entrega não encontrada
        </h1>

        <div className="editar-entrega-form__acoes">
          <Link
            to="/entregas"
            className="editar-entrega-form__retornar"
          >
            Retornar a Entregas
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="editar-entrega-page">
      <h1 className="editar-entrega-page__title">
        Editar
      </h1>

      <h2 className="editar-entrega-page__subtitle">
        Entregas
      </h2>

      <form
        className="editar-entrega-form"
        onSubmit={handleSubmit}
      >
        <div className="editar-entrega-form__grupo">
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
            disabled={editadaComSucesso}
            required
          />
        </div>

        <div className="editar-entrega-form__grupo">
          <label htmlFor="endereco">
            Endereço
          </label>

          <input
            id="endereco"
            type="text"
            value={endereco}
            onChange={(event) =>
              setEndereco(event.target.value)
            }
            disabled={editadaComSucesso}
            required
          />
        </div>

        <div className="editar-entrega-form__grupo">
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
            disabled={editadaComSucesso}
            required
          />

          {erroData && (
            <p className="editar-entrega-form__erro">
              Data Inválida
            </p>
          )}
        </div>

        <div className="editar-entrega-form__grupo">
          <label htmlFor="status">
            Status
          </label>

          <select
            id="status"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
            disabled={editadaComSucesso}
            required
          >
            <option value="Pendente">
              Pendente
            </option>

            <option value="Em Rota">
              Em Rota
            </option>

            <option value="Cancelado">
              Cancelado
            </option>

            <option value="Entregue">
              Entregue
            </option>
          </select>
        </div>

        {editadaComSucesso && (
          <div
            className="editar-entrega-alert"
            role="alert"
          >
            Entrega editada! Clique em
            {' '}
            &apos;Retornar a Entregas&apos;
            {' '}
            para retornar, ou
            {' '}
            &apos;+ Editar Entrega&apos;
            {' '}
            para editar novamente.
          </div>
        )}

        <div className="editar-entrega-form__acoes">
          {!editadaComSucesso && (
            <button
              type="submit"
              className="editar-entrega-form__salvar"
            >
              Salvar alterações
            </button>
          )}

          {editadaComSucesso && (
            <button
              type="button"
              className="editar-entrega-form__salvar"
              onClick={handleEditarNovamente}
            >
              + Editar Entrega
            </button>
          )}

          <Link
            to="/entregas"
            className="editar-entrega-form__retornar"
          >
            Retornar a Entregas
          </Link>
        </div>
      </form>
    </section>
  )
}

export default EditarEntrega