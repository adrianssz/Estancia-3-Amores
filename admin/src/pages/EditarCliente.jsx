import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { useClientes } from '../contexts/ClientesContext'
import '../styles/EditarCliente.css'

function FormularioEditarCliente({
  cliente,
  codigo,
  editarCliente,
}) {
  const [nome, setNome] = useState(cliente.nome)
  const [telefone, setTelefone] = useState(
    cliente.telefone
  )
  const [endereco, setEndereco] = useState(
    cliente.endereco
  )

  const [
    editadoComSucesso,
    setEditadoComSucesso,
  ] = useState(false)

  const [salvando, setSalvando] = useState(false)
  const [erroEdicao, setErroEdicao] = useState('')

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

  function handleTelefoneChange(event) {
    setTelefone(
      formatarTelefone(event.target.value)
    )
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const nomeTratado = nome.trim()
    const enderecoTratado = endereco.trim()

    if (nomeTratado.length < 3) {
      setErroEdicao(
        'O nome deve possuir pelo menos 3 caracteres.'
      )
      return
    }

    setSalvando(true)
    setErroEdicao('')

    try {
      await editarCliente(
        codigo,
        {
          nome: nomeTratado,
          telefone,
          endereco: enderecoTratado,
        }
      )

      setEditadoComSucesso(true)
    } catch (error) {
      console.error(
        'Erro ao editar cliente:',
        error
      )

      setErroEdicao(
        'Erro ao salvar as alterações. Tente novamente.'
      )
    } finally {
      setSalvando(false)
    }
  }

  function handleEditarNovamente() {
    setErroEdicao('')
    setEditadoComSucesso(false)
  }

  return (
    <section className="editar-cliente-page">
      <h1 className="editar-cliente-page__title">
        Editar
      </h1>

      <form
        className="editar-cliente-form"
        onSubmit={handleSubmit}
      >
        <div className="editar-cliente-form__grupo">
          <label htmlFor="nome">
            Nome
          </label>

          <input
            id="nome"
            type="text"
            minLength="3"
            value={nome}
            onChange={(event) =>
              setNome(event.target.value)
            }
            disabled={editadoComSucesso || salvando}
            required
          />
        </div>

        <div className="editar-cliente-form__grupo">
          <label htmlFor="telefone">
            Telefone
          </label>

          <input
            id="telefone"
            type="tel"
            value={telefone}
            onChange={handleTelefoneChange}
            disabled={editadoComSucesso || salvando}
            required
          />
        </div>

        <div className="editar-cliente-form__grupo">
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
            disabled={editadoComSucesso || salvando}
            required
          />
        </div>

        {erroEdicao && (
          <div
            className="editar-cliente-alert"
            role="alert"
          >
            {erroEdicao}
          </div>
        )}

        {editadoComSucesso && (
          <div
            className="editar-cliente-alert"
            role="alert"
          >
            Cliente editado! Clique em
            {' '}
            &apos;Retornar a Clientes&apos;
            {' '}
            para retornar, ou
            {' '}
            &apos;+ Editar Cliente&apos;
            {' '}
            para editar novamente.
          </div>
        )}

        <div className="editar-cliente-form__acoes">
          {!editadoComSucesso && (
            <button
              type="submit"
              className="editar-cliente-form__salvar"
              disabled={salvando}
            >
              {salvando
                ? 'Salvando...'
                : 'Salvar alterações'}
            </button>
          )}

          {editadoComSucesso && (
            <button
              type="button"
              className="editar-cliente-form__salvar"
              onClick={handleEditarNovamente}
            >
              + Editar Cliente
            </button>
          )}

          <Link
            to="/clientes"
            className="editar-cliente-form__retornar"
          >
            Retornar a Clientes
          </Link>
        </div>
      </form>
    </section>
  )
}

function EditarCliente() {
  const { codigo } = useParams()

  const {
    clientes,
    carregandoClientes,
    erroClientes,
    editarCliente,
  } = useClientes()

  const codigoNumerico = Number(codigo)

  if (carregandoClientes) {
    return (
      <section className="editar-cliente-page">
        <h1 className="editar-cliente-page__title">
          Editar
        </h1>

        <p>Carregando cliente...</p>
      </section>
    )
  }

  if (erroClientes) {
    return (
      <section className="editar-cliente-page">
        <h1 className="editar-cliente-page__title">
          Editar
        </h1>

        <p>{erroClientes}</p>

        <div className="editar-cliente-form__acoes">
          <Link
            to="/clientes"
            className="editar-cliente-form__retornar"
          >
            Retornar a Clientes
          </Link>
        </div>
      </section>
    )
  }

  const clienteSelecionado = clientes.find(
    (cliente) =>
      cliente.codigo === codigoNumerico
  )

  if (!clienteSelecionado) {
    return (
      <section className="editar-cliente-page">
        <h1 className="editar-cliente-page__title">
          Cliente não encontrado
        </h1>

        <div className="editar-cliente-form__acoes">
          <Link
            to="/clientes"
            className="editar-cliente-form__retornar"
          >
            Retornar a Clientes
          </Link>
        </div>
      </section>
    )
  }

  return (
    <FormularioEditarCliente
      cliente={clienteSelecionado}
      codigo={codigoNumerico}
      editarCliente={editarCliente}
    />
  )
}

export default EditarCliente