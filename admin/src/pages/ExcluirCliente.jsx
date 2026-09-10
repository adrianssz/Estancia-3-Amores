import { useState } from 'react'

import {
  Link,
  useParams,
} from 'react-router-dom'

import { useClientes } from '../contexts/ClientesContext'
import '../styles/ExcluirCliente.css'


function ConteudoExcluirCliente({
  cliente,
  codigo,
  excluirCliente,
}) {
  const [clienteExibido] = useState(cliente)

  const [
    excluidoComSucesso,
    setExcluidoComSucesso,
  ] = useState(false)

  const [excluindo, setExcluindo] = useState(false)
  const [erroExclusao, setErroExclusao] = useState('')


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


  async function handleExcluir() {
    setExcluindo(true)
    setErroExclusao('')

    try {
      await excluirCliente(codigo)

      setExcluidoComSucesso(true)
    } catch (error) {
      console.error(
        'Erro ao excluir cliente:',
        error
      )

      if (error.code === '23503') {
        setErroExclusao(
          'Este cliente não pode ser excluído pois possui registros vinculados.'
        )
      } else {
        setErroExclusao(
          'Erro ao excluir cliente. Tente novamente.'
        )
      }
    } finally {
      setExcluindo(false)
    }
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
            disabled={
              excluidoComSucesso ||
              excluindo
            }
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
            disabled={
              excluidoComSucesso ||
              excluindo
            }
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
            disabled={
              excluidoComSucesso ||
              excluindo
            }
          />

        </div>


        {erroExclusao && (
          <div
            className="excluir-cliente-alert"
            role="alert"
          >
            {erroExclusao}
          </div>
        )}


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
              disabled={excluindo}
            >
              {excluindo
                ? 'Excluindo...'
                : 'Excluir'}
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


function ExcluirCliente() {
  const { codigo } = useParams()

  const {
    clientes,
    carregandoClientes,
    erroClientes,
    excluirCliente,
  } = useClientes()

  const codigoNumerico = Number(codigo)

  const clienteSelecionado = clientes.find(
    (cliente) =>
      cliente.codigo === codigoNumerico
  )


  if (carregandoClientes) {
    return (
      <section className="excluir-cliente-page">

        <h1 className="excluir-cliente-page__title">
          Excluir
        </h1>

        <p>
          Carregando cliente...
        </p>

      </section>
    )
  }


  if (erroClientes) {
    return (
      <section className="excluir-cliente-page">

        <h1 className="excluir-cliente-page__title">
          Excluir
        </h1>

        <p>
          {erroClientes}
        </p>

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
    <ConteudoExcluirCliente
      key={codigo}
      cliente={clienteSelecionado}
      codigo={codigoNumerico}
      excluirCliente={excluirCliente}
    />
  )
}


export default ExcluirCliente