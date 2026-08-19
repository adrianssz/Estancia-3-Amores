import { useEffect, useState } from 'react'

import Header from '../components/Header'
import BottomMenu from '../components/BottomMenu'
import CartItem from '../components/CartItem'

import '../styles/Cesta.css'


function Cesta() {


  const [cesta, setCesta] = useState([])


  useEffect(() => {

    const cestaSalva =
      JSON.parse(
        localStorage.getItem('cesta')
      ) || []


    setCesta(cestaSalva)

  }, [])


  function removerProduto(id) {

    const novaCesta =
      cesta.filter(
        produto =>
        produto.id !== id
      )


    setCesta(novaCesta)


    localStorage.setItem(
      'cesta',
      JSON.stringify(novaCesta)
    )

    window.dispatchEvent(
      new Event('cestaAtualizada')
    )

  }


  const total = cesta.reduce(

    (soma, produto) => {

      return soma +
        (
          produto.preco *
          produto.quantidadeCesta
        )

    },

    0

  )


  function realizarPedido() {

    if (cesta.length === 0) {

      return

    }


    try {

      /*
        FUTURAMENTE:

        Aqui entraremos com:

        - ID do usuário
        - produtos
        - quantidade
        - total
        - Supabase / PHP
        - controle de estoque
      */


      alert(
        'Pedido realizado com sucesso!'
      )


      setCesta([])


      localStorage.removeItem(
        'cesta'
      )

      window.dispatchEvent(
        new Event('cestaAtualizada')
      )


    } catch (erro) {

      alert(
        'Falha ao processar pedido. Tente novamente em instantes'
      )

    }

  }


  return (

    <>

      <Header />


      <main className="cesta-page">


        <h1 className="cesta-title">
          Cesta
        </h1>


        <section className="cesta-container">


          {
            cesta.length > 0

            ?

            cesta.map((produto) => (

              <CartItem

                key={produto.id}

                produto={produto}

                removerProduto={
                  removerProduto
                }

              />

            ))

            :

            <div className="cesta-vazia">

              <p>
                Sua cesta está vazia.
              </p>

            </div>

          }


          <div className="cesta-total-area">

            <span>
              Total
            </span>


            <strong>

              R$ {total
                .toFixed(2)
                .replace('.', ',')}

            </strong>

          </div>


          <button

            className="realizar-pedido-button"

            onClick={realizarPedido}

            disabled={
              cesta.length === 0
            }

          >
            REALIZAR PEDIDO
          </button>


        </section>


      </main>


      <BottomMenu />

    </>

  )

}


export default Cesta