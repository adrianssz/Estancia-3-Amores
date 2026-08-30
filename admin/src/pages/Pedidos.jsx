import { useState } from 'react'
import { Link } from 'react-router-dom'

import { usePedidos } from '../contexts/PedidosContext'
import '../styles/Pedidos.css'

function Pedidos() {
  const { pedidos } = usePedidos()

  const [busca, setBusca] = useState('')
  const [termoPesquisa, setTermoPesquisa] = useState('')

  const termoNormalizado = termoPesquisa
    .trim()
    .toLowerCase()

  const pedidosFiltrados = pedidos.filter((pedido) => {
    if (!termoNormalizado) {
      return true
    }

    const clientePedido = pedido.cliente.toLowerCase()
    const codigoPedido = String(pedido.id)

    const clienteCorresponde =
      clientePedido.includes(termoNormalizado)

    const codigoCorresponde =
      codigoPedido === termoNormalizado

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
    <section className="pedidos-page">
      <h1 className="pedidos-page__title">
        Pedidos
      </h1>

      <form
        className="pedidos-busca"
        onSubmit={handlePesquisar}
      >
        <input
          type="text"
          className="pedidos-busca__campo"
          placeholder="Pesquisar por cliente ou pedido"
          value={busca}
          onChange={handleBuscaChange}
        />

        <button
          type="submit"
          className="pedidos-busca__botao"
          aria-label="Filtrar pedidos"
          title="Filtrar pedidos"
        >
          <svg
            className="pedidos-busca__icone"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              d="M4 5H20L14 12V18L10 20V12L4 5Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </form>

      <div className="pedidos-acoes">
        <Link
          to="/pedidos/adicionar"
          className="pedidos-adicionar"
        >
          + Adicionar Pedido
        </Link>
      </div>

      <h2 className="pedidos-listagem__title">
        ULTIMOS PEDIDOS
      </h2>

      <table className="pedidos-tabela">
        <thead>
          <tr>
            <th>Pedido</th>
            <th>Cliente</th>
            <th>Telefone</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {pedidosFiltrados.length > 0 ? (
            pedidosFiltrados.map((pedido) => (
              <tr key={pedido.id}>
                <td>{pedido.id}</td>
                <td>{pedido.cliente}</td>
                <td>{pedido.telefone}</td>
                <td>{pedido.status}</td>

                <td>
                  <Link
                    to={`/pedidos/${pedido.id}/editar`}
                  >
                    Editar
                  </Link>

                  {' | '}

                  <Link
                    to={`/pedidos/${pedido.id}/excluir`}
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
                className="pedidos-tabela__vazio"
              >
                Nenhum pedido encontrado
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  )
}

export default Pedidos