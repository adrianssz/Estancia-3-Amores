import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { useProdutos } from '../contexts/ProdutosContext'
import '../styles/ExcluirProduto.css'

function ExcluirProduto() {
  const { id } = useParams()

  const {
    produtos,
    excluirProduto,
  } = useProdutos()

  const produtoInicial = produtos.find(
    (produto) => produto.id === Number(id)
  )

  const [produtoExibido] = useState(produtoInicial)

  const [excluidoComSucesso, setExcluidoComSucesso] =
    useState(false)

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

  function handleExcluir() {
    excluirProduto(Number(id))
    setExcluidoComSucesso(true)
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
            disabled={excluidoComSucesso}
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
            disabled={excluidoComSucesso}
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
            disabled={excluidoComSucesso}
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
            disabled={excluidoComSucesso}
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
            disabled={excluidoComSucesso}
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
            disabled={excluidoComSucesso}
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
            disabled={excluidoComSucesso}
          />
        </div>

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
            >
              Excluir
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

export default ExcluirProduto