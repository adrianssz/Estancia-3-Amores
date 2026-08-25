import { useState } from 'react'

import '../styles/ProductCard.css'


function ProductCard({
  imagem,
  nome,
  preco
}) {

  const [erroImagem, setErroImagem] =
    useState(false)


  const mostrarImagem =
    imagem && !erroImagem


  return (
    <article className="product-card">

      <div className="product-card-image-area">

        {
          mostrarImagem

            ?

            <img
              src={imagem}
              alt={nome}
              className="product-card-image"
              loading="lazy"
              onError={() =>
                setErroImagem(true)
              }
            />

            :

            <div className="product-card-no-image">
              Sem Foto
            </div>
        }

      </div>


      <div className="product-card-content">

        <h3>
          {nome}
        </h3>

        <strong>
          R$ {preco}
        </strong>

      </div>

    </article>
  )
}


export default ProductCard