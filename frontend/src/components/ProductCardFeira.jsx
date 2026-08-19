import { useState } from 'react'

import '../styles/ProductCardFeira.css'


function ProductCardFeira({ produto }) {

  const [quantidade, setQuantidade] =
    useState(1)


  const produtoDisponivel =
    produto.status === 'pronta-entrega'


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

    if (!produtoDisponivel) {

      alert(
        'Este produto ainda está em crescimento.'
      )

      return
    }


    if (produto.estoque <= 0) {

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
        item =>
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
                novaQuantidade
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
            quantidade
        }

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
        !produtoDisponivel
          ? 'produto-crescimento'
          : ''
      }`}
    >


      <div className="feira-card-image">

        <span>
          {produto.imagem}
        </span>

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


      {
        produtoDisponivel

        ?

        <>

          <div className="quantidade-selector">

            <button
              type="button"
              onClick={diminuirQuantidade}
              disabled={quantidade === 1}
              aria-label="Diminuir quantidade"
            >
              −
            </button>


            <span>
              {quantidade}
            </span>


            <button
              type="button"
              onClick={aumentarQuantidade}
              disabled={
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
          >
            Adicionar
          </button>

        </>

        :

        <div className="crescimento-info">

          Em crescimento

        </div>
      }


    </article>

  )

}


export default ProductCardFeira