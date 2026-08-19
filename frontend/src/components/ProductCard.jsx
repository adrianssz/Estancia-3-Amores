import '../styles/ProductCard.css'

function ProductCard({ imagem, nome, preco }) {

  return (
    <div className="product-card">

      <img
        src={imagem}
        alt={nome}
      />


      <h3>
        {nome}
      </h3>


      <span>
        R$ {preco}
      </span>


    </div>
  )
}

export default ProductCard