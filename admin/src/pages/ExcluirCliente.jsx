import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { useClientes } from '../contexts/ClientesContext'
import '../styles/ExcluirCliente.css'

function ExcluirCliente() {
  const { codigo } = useParams()

  const {
    clientes,
    excluirCliente,
  } = useClientes()

  const clienteInicial = clientes.find(
    (cliente) => cliente.codigo === Number(codigo)
  )

  const [clienteExibido] = useState(clienteInicial)

  const [excluidoComSucesso, setExcluidoComSucesso] =
    useState(false)

  function handleExcluir() {
    excluirCliente(Number(codigo))
    setExcluidoComSucesso(true)
  }

  if (!clienteExibido) {
    return (
      <section className="excluir-cliente-page">
        <h1 className="excluir-cliente-page__title">
          Cliente não encontrado
        </h1>

        <div className="excluir-cliente-form__acoes">
          <Link
            to="/clientes"
            className="excluir-cliente-form__retornar"
          >
            Retornar a Clientes
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="excluir-cliente-page">
      <h1 className="excluir-cliente-page__title">
        Excluir
      </h1>

      <div className="excluir-cliente-form">
        <div className="excluir-cliente-form__grupo">
          <label htmlFor="nome">
            Nome
          </label>

          <input
            id="nome"
            type="text"
            value={clienteExibido.nome}
            readOnly
            disabled={excluidoComSucesso}
          />
        </div>

        <div className="excluir-cliente-form__grupo">
          <label htmlFor="telefone">
            Telefone
          </label>

          <input
            id="telefone"
            type="text"
            value={clienteExibido.telefone}
            readOnly
            disabled={excluidoComSucesso}
          />
        </div>

        <div className="excluir-cliente-form__grupo">
          <label htmlFor="endereco">
            Endereço
          </label>

          <input
            id="endereco"
            type="text"
            value={clienteExibido.endereco}
            readOnly
            disabled={excluidoComSucesso}
          />
        </div>

        {excluidoComSucesso && (
          <div
            className="excluir-cliente-alert"
            role="alert"
          >
            Cliente excluído! Clique em
            {' '}
            &apos;Retornar a Clientes&apos;
            {' '}
            para retornar.
          </div>
        )}

        <div className="excluir-cliente-form__acoes">
          {!excluidoComSucesso && (
            <button
              type="button"
              className="excluir-cliente-form__excluir"
              onClick={handleExcluir}
            >
              Excluir
            </button>
          )}

          <Link
            to="/clientes"
            className="excluir-cliente-form__retornar"
          >
            Retornar a Clientes
          </Link>
        </div>
      </div>
    </section>
  )
}

export default ExcluirCliente