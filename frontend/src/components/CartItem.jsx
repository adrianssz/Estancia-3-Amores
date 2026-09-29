import { useState } from 'react'
import { FaTrash } from 'react-icons/fa'

import '../styles/CartItem.css'


function CartItem({
  produto,
  removerProduto,
  aumentarQuantidade,
  diminuirQuantidade,
}) {
  const [erroImagem, setErroImagem] =
    useState(false)

  const preco =
    Number(produto.preco) || 0

  const quantidade =
    Number(
      produto.quantidadeCesta
    ) || 1

  const estoque =
    Number(produto.estoque)

  const subtotal =
    preco * quantidade

  const mostrarImagem =
    Boolean(produto.imagem) &&
    !erroImagem

  const limiteEstoqueAtingido =
    Number.isFinite(estoque) &&
    quantidade >= estoque


  return (
    <article className="cart-item">
      <div className="cart-product-image">
        {mostrarImagem ? (
          <img
            className="cart-product-image-real"
            src={produto.imagem}
            alt={produto.nome}
            loading="lazy"
            onError={() =>
              setErroImagem(true)
            }
          />
        ) : (
          <span className="cart-product-image-content">
            Sem Foto
          </span>
        )}
      </div>


      <div className="cart-item-info">
        <button
          type="button"
          className="cart-remove-button"
          onClick={() =>
            removerProduto(produto.id)
          }
          aria-label={
            `Remover ${produto.nome} da cesta`
          }
          title="Remover produto"
        >
          <FaTrash />
        </button>


        <p className="cart-product-name">
          {produto.nome}
        </p>

        <p className="cart-product-unit">
          {produto.unidade}
        </p>


        <div className="cart-quantity-selector">
          <button
            type="button"
            onClick={() =>
              diminuirQuantidade(
                produto.id
              )
            }
            disabled={
              quantidade <= 1
            }
            aria-label="Diminuir quantidade"
          >
            −
          </button>

          <span>
            {quantidade}
          </span>

          <button
            type="button"
            onClick={() =>
              aumentarQuantidade(
                produto.id
              )
            }
            disabled={
              limiteEstoqueAtingido
            }
            aria-label="Aumentar quantidade"
          >
            +
          </button>
        </div>


        {Number.isFinite(estoque) && (
          <p className="cart-stock-info">
            Estoque: {estoque}
          </p>
        )}
      </div>


      <strong className="cart-product-price">
        R$ {subtotal
          .toFixed(2)
          .replace('.', ',')}
      </strong>
    </article>
  )
}


export default CartItem