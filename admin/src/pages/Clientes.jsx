import { useState } from 'react'
import { Link } from 'react-router-dom'

import { useClientes } from '../contexts/ClientesContext'
import '../styles/Clientes.css'

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
        >
          Pesquisar
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
                <td>{cliente.codigo}</td>
                <td>{cliente.nome}</td>
                <td>{cliente.telefone}</td>

                <td>
                  <Link
                    to={`/clientes/${cliente.codigo}/editar`}
                  >
                    Editar
                  </Link>

                  {' | '}

                  <Link
                    to={`/clientes/${cliente.codigo}/excluir`}
                  >
                    Excluir
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">
                Nenhum cliente encontrado
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  )
}

export default Clientes