import { useState } from 'react'
import { Link } from 'react-router-dom'

import { useEntregas } from '../contexts/EntregasContext'
import '../styles/Entregas.css'

function Entregas() {
  const { entregas } = useEntregas()

  const [busca, setBusca] = useState('')
  const [termoPesquisa, setTermoPesquisa] = useState('')

  const termoNormalizado = termoPesquisa
    .trim()
    .toLowerCase()

  const entregasFiltradas = entregas.filter((entrega) => {
    if (!termoNormalizado) {
      return true
    }

    const clienteEntrega = entrega.cliente.toLowerCase()
    const codigoEntrega = String(entrega.codigo)

    const clienteCorresponde =
      clienteEntrega.includes(termoNormalizado)

    const codigoCorresponde =
      codigoEntrega === termoNormalizado

    return clienteCorresponde || codigoCorresponde
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
    <section className="entregas-page">
      <h1 className="entregas-page__title">
        Entregas
      </h1>

      <form
        className="entregas-busca"
        onSubmit={handlePesquisar}
      >
        <input
          type="text"
          className="entregas-busca__campo"
          placeholder="Pesquisar por cliente ou código"
          value={busca}
          onChange={handleBuscaChange}
        />

        <button
          type="submit"
          className="entregas-busca__botao"
        >
          Pesquisar
        </button>
      </form>

      <div className="entregas-acoes">
        <Link
          to="/entregas/adicionar"
          className="entregas-adicionar"
        >
          + Adicionar Entrega
        </Link>
      </div>

      <table className="entregas-tabela">
        <thead>
          <tr>
            <th>Código</th>
            <th>Cliente</th>
            <th>Data</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {entregasFiltradas.length > 0 ? (
            entregasFiltradas.map((entrega) => (
              <tr key={entrega.codigo}>
                <td>{entrega.codigo}</td>
                <td>{entrega.cliente}</td>
                <td>{entrega.data}</td>
                <td>{entrega.status}</td>

                <td>
                  <Link
                    to={`/entregas/${entrega.codigo}/editar`}
                  >
                    Editar
                  </Link>

                  {' | '}

                  <Link
                    to={`/entregas/${entrega.codigo}/excluir`}
                  >
                    Excluir
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="5"
                className="entregas-tabela__vazio"
              >
                Nenhuma entrega encontrada
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  )
}

export default Entregas