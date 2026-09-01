import { useState } from 'react'
import { Link } from 'react-router-dom'

import { useClientes } from '../contexts/ClientesContext'
import '../styles/Clientes.css'


function IconePesquisar() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        cx="11"
        cy="11"
        r="6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />

      <path
        d="m16 16 4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}


function IconeEditar() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M4 16.5V20h3.5L18.3 9.2l-3.5-3.5L4 16.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="m13.8 6.7 3.5 3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}


function IconeExcluir() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M4 7h16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M9 7V4h6v3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M7 7l1 13h8l1-13"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M10 11v5M14 11v5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}


function Clientes() {
  const { clientes } = useClientes()

  const [busca, setBusca] = useState('')
  const [termoPesquisa, setTermoPesquisa] = useState('')


  const termoNormalizado = termoPesquisa
    .trim()
    .toLowerCase()


  const clientesFiltrados = clientes.filter((cliente) => {
    if (!termoNormalizado) {
      return true
    }

    const nomeCliente = cliente.nome.toLowerCase()
    const codigoCliente = String(cliente.codigo)

    const nomeCorresponde =
      nomeCliente.includes(termoNormalizado)

    const codigoCorresponde =
      codigoCliente === termoNormalizado

    return nomeCorresponde || codigoCorresponde
  })


  function handlePesquisar(event) {
    event.preventDefault()

    setTermoPesquisa(busca)
  }


  function handleBuscaChange(event) {
    const novoValor = event.target.value

    setBusca(novoValor)

    if (novoValor === '') {
      setTermoPesquisa('')
    }
  }


  return (
    <section className="clientes-page">

      <h1 className="clientes-page__title">
        Clientes
      </h1>


      <form
        className="clientes-busca"
        onSubmit={handlePesquisar}
      >

        <input
          type="text"
          className="clientes-busca__campo"
          placeholder="Pesquisar por nome ou código"
          value={busca}
          onChange={handleBuscaChange}
        />


        <button
          type="submit"
          className="clientes-busca__botao"
          aria-label="Pesquisar clientes"
          title="Pesquisar"
        >
          <IconePesquisar />
        </button>

      </form>


      <div className="clientes-acoes">

        <Link
          to="/clientes/adicionar"
          className="clientes-adicionar"
        >
          + Adicionar Cliente
        </Link>

      </div>


      <div className="clientes-tabela-wrapper">

        <table className="clientes-tabela">

          <thead>
            <tr>
              <th>Código</th>
              <th>Nome</th>
              <th>Telefone</th>
              <th>Ações</th>
            </tr>
          </thead>


          <tbody>

            {clientesFiltrados.length > 0 ? (

              clientesFiltrados.map((cliente) => (

                <tr key={cliente.codigo}>

                  <td data-label="Código">
                    {cliente.codigo}
                  </td>


                  <td
                    className="clientes-tabela__nome"
                    data-label="Nome"
                  >
                    {cliente.nome}
                  </td>


                  <td data-label="Telefone">
                    {cliente.telefone}
                  </td>


                  <td
                    className="clientes-tabela__acoes"
                    data-label="Ações"
                  >

                    <div className="clientes-tabela__acoes-conteudo">

                      <Link
                        to={`/clientes/${cliente.codigo}/editar`}
                        className="clientes-acao clientes-acao--editar"
                        aria-label={`Editar cliente ${cliente.nome}`}
                        title="Editar"
                      >
                        <IconeEditar />
                      </Link>


                      <Link
                        to={`/clientes/${cliente.codigo}/excluir`}
                        className="clientes-acao clientes-acao--excluir"
                        aria-label={`Excluir cliente ${cliente.nome}`}
                        title="Excluir"
                      >
                        <IconeExcluir />
                      </Link>

                    </div>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan="4"
                  className="clientes-tabela__vazio"
                >
                  Nenhum cliente encontrado
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </section>
  )
}


export default Clientes