import { useState } from 'react'
import { Link } from 'react-router-dom'

import { useProdutos } from '../contexts/ProdutosContext'
import '../styles/Produtos.css'


function Produtos() {
  const { produtos } = useProdutos()

  const [busca, setBusca] = useState('')
  const [termoPesquisa, setTermoPesquisa] = useState('')


  const termoNormalizado = termoPesquisa
    .trim()
    .toLowerCase()


  const produtosFiltrados = produtos.filter((produto) => {
    if (!termoNormalizado) {
      return true
    }

    const nomeProduto = produto.nome.toLowerCase()
    const codigoProduto = String(produto.id)

    const nomeCorresponde =
      nomeProduto.includes(termoNormalizado)

    const codigoCorresponde =
      codigoProduto === termoNormalizado

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


  function formatarPreco(valor) {
    return Number(valor).toLocaleString(
      'pt-BR',
      {
        style: 'currency',
        currency: 'BRL',
      }
    )
  }


  function formatarStatus(status) {
    if (status === 'pronta-entrega') {
      return 'Pronta Entrega'
    }

    if (status === 'em-crescimento') {
      return 'Em Crescimento'
    }

    return status
  }


  return (
    <section className="produtos-page">

      <h1 className="produtos-page__title">
        Produtos
      </h1>


      <form
        className="produtos-busca"
        onSubmit={handlePesquisar}
      >

        <input
          type="text"
          className="produtos-busca__campo"
          placeholder="Pesquisar por produto ou código"
          value={busca}
          onChange={handleBuscaChange}
        />


        <button
          type="submit"
          className="produtos-busca__botao"
        >
          Pesquisar
        </button>

      </form>


      <div className="produtos-acoes">

        <Link
          to="/produtos/adicionar"
          className="produtos-adicionar"
        >
          + Adicionar Produto
        </Link>

      </div>


      <div className="produtos-tabela-wrapper">

        <table className="produtos-tabela">

          <thead>
            <tr>
              <th>Código</th>
              <th>Produto</th>
              <th>Unidade</th>
              <th>Preço</th>
              <th>Categoria</th>
              <th>Status</th>
              <th>Estoque</th>
              <th>Ações</th>
            </tr>
          </thead>


          <tbody>

            {produtosFiltrados.length > 0 ? (

              produtosFiltrados.map((produto) => (

                <tr key={produto.id}>

                  <td data-label="Código">
                    {produto.id}
                  </td>


                  <td
                    className="produtos-tabela__produto"
                    data-label="Produto"
                  >
                    {produto.nome}
                  </td>


                  <td data-label="Unidade">
                    {produto.unidade}
                  </td>


                  <td data-label="Preço">
                    {formatarPreco(produto.preco)}
                  </td>


                  <td data-label="Categoria">
                    {produto.categoria}
                  </td>


                  <td data-label="Status">

                    <span
                      className={`produtos-status produtos-status--${produto.status}`}
                    >
                      {formatarStatus(produto.status)}
                    </span>

                  </td>


                  <td data-label="Estoque">
                    {produto.estoque}
                  </td>


                  <td
                    className="produtos-tabela__acoes"
                    data-label="Ações"
                  >

                    <div className="produtos-tabela__acoes-conteudo">

                      <Link
                        to={`/produtos/${produto.id}/editar`}
                        className="produtos-acao produtos-acao--editar"
                      >
                        Editar
                      </Link>


                      <Link
                        to={`/produtos/${produto.id}/excluir`}
                        className="produtos-acao produtos-acao--excluir"
                      >
                        Excluir
                      </Link>

                    </div>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan="8"
                  className="produtos-tabela__vazio"
                >
                  Nenhum produto encontrado
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </section>
  )
}


export default Produtos