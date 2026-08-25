import { FaTrash } from 'react-icons/fa'

import '../styles/CartItem.css'


function CartItem({
  produto,
  removerProduto
}) {

  const subtotal =
    produto.preco *
    produto.quantidadeCesta


  return (
    <article className="cart-item">

      <div className="cart-product-image">

        <span
          className="cart-product-image-content"
          aria-hidden="true"
        >
          {produto.imagem}
        </span>

      </div>


      <div className="cart-item-info">

        <button
          type="button"
          className="cart-remove-button"
          onClick={() =>
            removerProduto(produto.id)
          }
          aria-label={`Remover ${produto.nome} da cesta`}
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


        <p className="cart-product-quantity">
          {produto.quantidadeCesta} X
        </p>

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