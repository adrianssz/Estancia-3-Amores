import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { useClientes } from '../contexts/ClientesContext'
import '../styles/EditarCliente.css'

function EditarCliente() {
  const { codigo } = useParams()

  const {
    clientes,
    editarCliente,
  } = useClientes()

  const clienteSelecionado = clientes.find(
    (cliente) => cliente.codigo === Number(codigo)
  )

  const [nome, setNome] = useState(
    clienteSelecionado?.nome ?? ''
  )

  const [telefone, setTelefone] = useState(
    clienteSelecionado?.telefone ?? ''
  )

  const [endereco, setEndereco] = useState(
    clienteSelecionado?.endereco ?? ''
  )

  const [editadoComSucesso, setEditadoComSucesso] =
    useState(false)

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

  function handleSubmit(event) {
    event.preventDefault()

    editarCliente(
      Number(codigo),
      {
        nome: nome.trim(),
        telefone,
        endereco: endereco.trim(),
      }
    )

    setEditadoComSucesso(true)
  }

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
            required
          />
        </div>

        {editadoComSucesso && (
          <div
            className="editar-cliente-alert"
            role="alert"
          >
            Cliente editado! Clique em
            {' '}
            &apos;Retornar a Clientes&apos;
            {' '}
            para retornar, ou continue editando
            para realizar novas alterações.
          </div>
        )}

        <div className="editar-cliente-form__acoes">
          <button
            type="submit"
            className="editar-cliente-form__salvar"
          >
            Salvar alterações
          </button>

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

export default EditarCliente