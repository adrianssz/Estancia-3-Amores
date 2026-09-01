import { useState } from 'react'
import { Link } from 'react-router-dom'

import { useEntregas } from '../contexts/EntregasContext'
import '../styles/Entregas.css'


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
        strokeWidth="1.8"
      />

      <path
        d="M16 16l4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
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


function classeStatus(status) {
  if (status === 'Pendente') {
    return 'entregas-status--pendente'
  }

  if (status === 'Em Rota') {
    return 'entregas-status--em-rota'
  }

  if (status === 'Cancelado') {
    return 'entregas-status--cancelado'
  }

  if (status === 'Entregue') {
    return 'entregas-status--entregue'
  }

  return ''
}


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
          aria-label="Pesquisar entregas"
          title="Pesquisar entregas"
        >
          <IconePesquisar />
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


      <h2 className="entregas-listagem__title">
        ENTREGAS
      </h2>


      <div className="entregas-tabela-wrapper">

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

                  <td data-label="Código">
                    {entrega.codigo}
                  </td>


                  <td
                    className="entregas-tabela__cliente"
                    data-label="Cliente"
                  >
                    {entrega.cliente}
                  </td>


                  <td data-label="Data">
                    {entrega.data}
                  </td>


                  <td data-label="Status">

                    <span
                      className={`entregas-status ${classeStatus(
                        entrega.status
                      )}`}
                    >
                      {entrega.status}
                    </span>

                  </td>


                  <td
                    className="entregas-tabela__acoes"
                    data-label="Ações"
                  >

                    <div className="entregas-tabela__acoes-conteudo">

                      <Link
                        to={`/entregas/${entrega.codigo}/editar`}
                        className="entregas-acao entregas-acao--editar"
                        aria-label={`Editar entrega ${entrega.codigo}`}
                        title="Editar"
                      >
                        <IconeEditar />
                      </Link>


                      <Link
                        to={`/entregas/${entrega.codigo}/excluir`}
                        className="entregas-acao entregas-acao--excluir"
                        aria-label={`Excluir entrega ${entrega.codigo}`}
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
                  className="entregas-tabela__vazio"
                >
                  Nenhuma entrega encontrada
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </section>
  )
}


export default Entregas