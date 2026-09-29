import { useState } from 'react'

import '../styles/ProductCardFeira.css'

function ProductCardFeira({ produto }) {
  const [quantidade, setQuantidade] =
    useState(1)

  const [erroImagem, setErroImagem] =
    useState(false)

  const prontaEntrega =
    produto.status === 'pronta-entrega'

  const possuiEstoque =
    produto.estoque > 0

  const mostrarImagem =
    Boolean(produto.imagem) &&
    !erroImagem

  function aumentarQuantidade() {
    if (quantidade >= produto.estoque) {
      alert(
        'Quantidade máxima disponível em estoque atingida.'
      )

      return
    }

    setQuantidade(
      quantidade + 1
    )
  }

  function diminuirQuantidade() {
    if (quantidade <= 1) {
      return
    }

    setQuantidade(
      quantidade - 1
    )
  }

  function adicionarNaCesta() {
    if (!prontaEntrega) {
      alert(
        'Este produto ainda está em crescimento.'
      )

      return
    }

    if (!possuiEstoque) {
      alert(
        'Produto esgotado.'
      )

      return
    }

    if (quantidade > produto.estoque) {
      alert(
        'Quantidade indisponível em estoque.'
      )

      return
    }

    const cestaAtual =
      JSON.parse(
        localStorage.getItem('cesta')
      ) || []

    const produtoExistente =
      cestaAtual.find(
        (item) =>
          item.id === produto.id
      )

    let novaCesta

    if (produtoExistente) {
      const novaQuantidade =
        produtoExistente.quantidadeCesta +
        quantidade

      if (
        novaQuantidade >
        produto.estoque
      ) {
        alert(
          'A quantidade solicitada ultrapassa o estoque disponível.'
        )

        return
      }

      novaCesta =
        cestaAtual.map((item) => {
          if (
            item.id === produto.id
          ) {
            return {
              ...item,
              quantidadeCesta:
                novaQuantidade,
            }
          }

          return item
        })
    } else {
      novaCesta = [
        ...cestaAtual,
        {
          ...produto,
          quantidadeCesta:
            quantidade,
        },
      ]
    }

    localStorage.setItem(
      'cesta',
      JSON.stringify(novaCesta)
    )

    window.dispatchEvent(
      new Event('cestaAtualizada')
    )

    alert(
      `${quantidade} unidade(s) adicionada(s) à cesta!`
    )

    setQuantidade(1)
  }

  return (
    <article
      className={`feira-card ${
        !prontaEntrega
          ? 'produto-crescimento'
          : ''
      }`}
    >
      <div className="feira-card-image">
        {mostrarImagem ? (
          <img
            src={produto.imagem}
            alt={produto.nome}
            loading="lazy"
            onError={() =>
              setErroImagem(true)
            }
          />
        ) : (
          <span>
            Sem Foto
          </span>
        )}
      </div>

      <div className="feira-card-content">
        <h3>
          {produto.nome}
        </h3>

        <p>
          {produto.unidade}
        </p>

        <strong>
          R$ {produto.preco
            .toFixed(2)
            .replace('.', ',')}
        </strong>
      </div>

      {prontaEntrega ? (
        <>
          <div className="quantidade-selector">
            <button
              type="button"
              onClick={diminuirQuantidade}
              disabled={
                quantidade === 1 ||
                !possuiEstoque
              }
              aria-label="Diminuir quantidade"
            >
              −
            </button>

            <span>
              {possuiEstoque
                ? quantidade
                : 0}
            </span>

            <button
              type="button"
              onClick={aumentarQuantidade}
              disabled={
                !possuiEstoque ||
                quantidade >=
                  produto.estoque
              }
              aria-label="Aumentar quantidade"
            >
              +
            </button>
          </div>

          <p className="estoque-info">
            {produto.estoque}
            {' '}
            unidade(s) disponíveis
          </p>

          <button
            type="button"
            className="adicionar-button"
            onClick={adicionarNaCesta}
            disabled={!possuiEstoque}
          >
            {possuiEstoque
              ? 'Adicionar'
              : 'Esgotado'}
          </button>
        </>
      ) : (
        <div className="crescimento-info">
          Em crescimento
        </div>
      )}
    </article>
  )
}

export default ProductCardFeira