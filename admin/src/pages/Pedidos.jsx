import { useState } from 'react'
import { Link } from 'react-router-dom'

import { usePedidos } from '../contexts/PedidosContext'
import '../styles/Pedidos.css'


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


function classeStatus(status) {
  if (status === 'Pendente') {
    return 'pedidos-status--pendente'
  }

  if (status === 'Em Rota') {
    return 'pedidos-status--em-rota'
  }

  if (status === 'Entregue') {
    return 'pedidos-status--entregue'
  }

  return ''
}


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


      <div className="pedidos-tabela-wrapper">

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

                  <td data-label="Pedido">
                    {pedido.id}
                  </td>


                  <td
                    className="pedidos-tabela__cliente"
                    data-label="Cliente"
                  >
                    {pedido.cliente}
                  </td>


                  <td data-label="Telefone">
                    {pedido.telefone}
                  </td>


                  <td data-label="Status">

                    <span
                      className={`pedidos-status ${classeStatus(
                        pedido.status
                      )}`}
                    >
                      {pedido.status}
                    </span>

                  </td>


                  <td
                    className="pedidos-tabela__acoes"
                    data-label="Ações"
                  >

                    <div className="pedidos-tabela__acoes-conteudo">

                      <Link
                        to={`/pedidos/${pedido.id}/editar`}
                        className="pedidos-acao pedidos-acao--editar"
                        aria-label={`Editar pedido ${pedido.id}`}
                        title="Editar"
                      >
                        <IconeEditar />
                      </Link>


                      <Link
                        to={`/pedidos/${pedido.id}/excluir`}
                        className="pedidos-acao pedidos-acao--excluir"
                        aria-label={`Excluir pedido ${pedido.id}`}
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
                  colSpan="5"
                  className="pedidos-tabela__vazio"
                >
                  Nenhum pedido encontrado
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </section>
  )
}


export default Pedidos