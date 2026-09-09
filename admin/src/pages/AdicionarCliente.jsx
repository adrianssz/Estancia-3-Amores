import { useState } from 'react'
import { Link } from 'react-router-dom'

import { useClientes } from '../contexts/ClientesContext'
import '../styles/AdicionarCliente.css'

function AdicionarCliente() {
  const { adicionarCliente } = useClientes()

  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [endereco, setEndereco] = useState('')

  const [adicionadoComSucesso, setAdicionadoComSucesso] =
    useState(false)

  const [salvando, setSalvando] = useState(false)
  const [erroCadastro, setErroCadastro] = useState('')

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
      setErroCadastro(
        'O nome deve possuir pelo menos 3 caracteres.'
      )
      return
    }

    const novoCliente = {
      nome: nomeTratado,
      telefone,
      endereco: enderecoTratado,
    }

    setSalvando(true)
    setErroCadastro('')

    try {
      await adicionarCliente(novoCliente)

      setAdicionadoComSucesso(true)
    } catch (error) {
      console.error(
        'Erro ao adicionar cliente:',
        error
      )

      setErroCadastro(
        'Erro ao salvar cliente. Tente novamente.'
      )
    } finally {
      setSalvando(false)
    }
  }

  function handleNovoCliente() {
    setNome('')
    setTelefone('')
    setEndereco('')
    setErroCadastro('')
    setAdicionadoComSucesso(false)
  }

  return (
    <section className="adicionar-cliente-page">
      <h1 className="adicionar-cliente-page__title">
        Adicionar
      </h1>

      <form
        className="adicionar-cliente-form"
        onSubmit={handleSubmit}
      >
        <div className="adicionar-cliente-form__grupo">
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
            disabled={adicionadoComSucesso || salvando}
            required
          />
        </div>

        <div className="adicionar-cliente-form__grupo">
          <label htmlFor="telefone">
            Telefone
          </label>

          <input
            id="telefone"
            type="tel"
            value={telefone}
            onChange={handleTelefoneChange}
            placeholder="(44) 99999-9999"
            disabled={adicionadoComSucesso || salvando}
            required
          />
        </div>

        <div className="adicionar-cliente-form__grupo">
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
            disabled={adicionadoComSucesso || salvando}
            required
          />
        </div>

        {erroCadastro && (
          <div
            className="adicionar-cliente-alert"
            role="alert"
          >
            {erroCadastro}
          </div>
        )}

        {adicionadoComSucesso && (
          <div
            className="adicionar-cliente-alert"
            role="alert"
          >
            Cliente adicionado! Clique em
            {' '}
            &apos;Retornar a Clientes&apos;
            {' '}
            para retornar, ou
            {' '}
            &apos;+ Adicionar Cliente&apos;
            {' '}
            para cadastrar um novo cliente.
          </div>
        )}

        <div className="adicionar-cliente-form__acoes">
          {!adicionadoComSucesso && (
            <button
              type="submit"
              className="adicionar-cliente-form__adicionar"
              disabled={salvando}
            >
              {salvando
                ? 'Salvando...'
                : '+ Adicionar Cliente'}
            </button>
          )}

          {adicionadoComSucesso && (
            <button
              type="button"
              className="adicionar-cliente-form__adicionar"
              onClick={handleNovoCliente}
            >
              + Adicionar Cliente
            </button>
          )}

          <Link
            to="/clientes"
            className="adicionar-cliente-form__retornar"
          >
            Retornar a Clientes
          </Link>
        </div>
      </form>
    </section>
  )
}

export default AdicionarCliente