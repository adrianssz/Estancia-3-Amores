import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { useProdutos } from '../contexts/ProdutosContext'
import '../styles/ExcluirProduto.css'

function ConteudoExcluirProduto({
  produto,
  excluirProduto,
}) {
  const [produtoExibido] = useState(produto)

  const [excluidoComSucesso, setExcluidoComSucesso] =
    useState(false)

  const [excluindo, setExcluindo] = useState(false)
  const [erroExclusao, setErroExclusao] = useState('')

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

  async function handleExcluir() {
    setExcluindo(true)
    setErroExclusao('')

    try {
      await excluirProduto(produtoExibido.id)

      setExcluidoComSucesso(true)
    } catch (error) {
      console.error(
        'Erro ao excluir produto:',
        error
      )

      if (error?.code === '23503') {
        setErroExclusao(
          'Este produto não pode ser excluído pois possui registros vinculados.'
        )
      } else {
        setErroExclusao(
          'Erro ao excluir produto. Tente novamente.'
        )
      }
    } finally {
      setExcluindo(false)
    }
  }

  if (!produtoExibido) {
    return (
      <section className="excluir-produto-page">
        <h1 className="excluir-produto-page__title">
          Produto não encontrado
        </h1>

        <div className="excluir-produto-form__acoes">
          <Link
            to="/produtos"
            className="excluir-produto-form__retornar"
          >
            Retornar a Produtos
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="excluir-produto-page">
      <h1 className="excluir-produto-page__title">
        Excluir Produto
      </h1>

      <div className="excluir-produto-form">
        <div className="excluir-produto-form__grupo">
          <label htmlFor="nome">
            Nome
          </label>

          <input
            id="nome"
            type="text"
            value={produtoExibido.nome}
            readOnly
            disabled={excluidoComSucesso || excluindo}
          />
        </div>

        <div className="excluir-produto-form__grupo">
          <label htmlFor="unidade">
            Unidade
          </label>

          <input
            id="unidade"
            type="text"
            value={produtoExibido.unidade}
            readOnly
            disabled={excluidoComSucesso || excluindo}
          />
        </div>

        <div className="excluir-produto-form__grupo">
          <label htmlFor="preco">
            Preço
          </label>

          <input
            id="preco"
            type="text"
            value={formatarPreco(produtoExibido.preco)}
            readOnly
            disabled={excluidoComSucesso || excluindo}
          />
        </div>

        <div className="excluir-produto-form__grupo">
          <label htmlFor="categoria">
            Categoria
          </label>

          <input
            id="categoria"
            type="text"
            value={produtoExibido.categoria}
            readOnly
            disabled={excluidoComSucesso || excluindo}
          />
        </div>

        <div className="excluir-produto-form__grupo">
          <label htmlFor="status">
            Status
          </label>

          <input
            id="status"
            type="text"
            value={formatarStatus(produtoExibido.status)}
            readOnly
            disabled={excluidoComSucesso || excluindo}
          />
        </div>

        <div className="excluir-produto-form__grupo">
          <label htmlFor="estoque">
            Estoque
          </label>

          <input
            id="estoque"
            type="text"
            value={produtoExibido.estoque}
            readOnly
            disabled={excluidoComSucesso || excluindo}
          />
        </div>

        <div className="excluir-produto-form__grupo">
          <label htmlFor="imagem">
            Imagem
          </label>

          <input
            id="imagem"
            type="text"
            value={produtoExibido.imagem}
            readOnly
            disabled={excluidoComSucesso || excluindo}
          />
        </div>

        {erroExclusao && (
          <div
            className="excluir-produto-alert"
            role="alert"
          >
            {erroExclusao}
          </div>
        )}

        {excluidoComSucesso && (
          <div
            className="excluir-produto-alert"
            role="alert"
          >
            Produto excluído! Clique em
            {' '}
            &apos;Retornar a Produtos&apos;
            {' '}
            para retornar.
          </div>
        )}

        <div className="excluir-produto-form__acoes">
          {!excluidoComSucesso && (
            <button
              type="button"
              className="excluir-produto-form__excluir"
              onClick={handleExcluir}
              disabled={excluindo}
            >
              {excluindo
                ? 'Excluindo...'
                : 'Excluir'}
            </button>
          )}

          <Link
            to="/produtos"
            className="excluir-produto-form__retornar"
          >
            Retornar a Produtos
          </Link>
        </div>
      </div>
    </section>
  )
}

function ExcluirProduto() {
  const { id } = useParams()

  const {
    produtos,
    carregandoProdutos,
    erroProdutos,
    excluirProduto,
  } = useProdutos()

  if (carregandoProdutos) {
    return (
      <section className="excluir-produto-page">
        <h1 className="excluir-produto-page__title">
          Carregando produto...
        </h1>
      </section>
    )
  }

  if (erroProdutos) {
    return (
      <section className="excluir-produto-page">
        <h1 className="excluir-produto-page__title">
          Não foi possível carregar o produto
        </h1>

        <div className="excluir-produto-form__acoes">
          <Link
            to="/produtos"
            className="excluir-produto-form__retornar"
          >
            Retornar a Produtos
          </Link>
        </div>
      </section>
    )
  }

  const produtoSelecionado = produtos.find(
    (produto) => produto.id === Number(id)
  )

  return (
    <ConteudoExcluirProduto
      produto={produtoSelecionado}
      excluirProduto={excluirProduto}
    />
  )
}

export default ExcluirProduto