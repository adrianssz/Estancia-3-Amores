import { useEffect, useState } from 'react'

import Header from '../components/Header'
import BottomMenu from '../components/BottomMenu'
import CartItem from '../components/CartItem'

import '../styles/Cesta.css'


function Cesta() {

  const [cesta, setCesta] = useState([])

  const telefoneWhatsApp = '5544998125510'


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


    const itensPedido =
      cesta.map((produto) => {

        const subtotal =
          produto.preco *
          produto.quantidadeCesta

        const subtotalFormatado =
          subtotal
            .toFixed(2)
            .replace('.', ',')

        return (
          `• ${produto.quantidadeCesta}x ${produto.nome}` +
          ` (${produto.unidade})` +
          ` - R$ ${subtotalFormatado}`
        )

      })


    const totalFormatado =
      total
        .toFixed(2)
        .replace('.', ',')


    const mensagem = [
      'Olá! Gostaria de realizar um pedido na Estância 3 Amores.',
      '',
      'Itens do pedido:',
      ...itensPedido,
      '',
      `Total: R$ ${totalFormatado}`
    ].join('\n')


    const whatsappUrl =
      `https://wa.me/${telefoneWhatsApp}?text=${encodeURIComponent(mensagem)}`


    try {

      window.open(
        whatsappUrl,
        '_blank',
        'noopener,noreferrer'
      )

    } catch {

      alert(
        'Não foi possível abrir o WhatsApp. Tente novamente em instantes.'
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
                  removerProduto={removerProduto}
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
            type="button"
            className="realizar-pedido-button"
            onClick={realizarPedido}
            disabled={cesta.length === 0}
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