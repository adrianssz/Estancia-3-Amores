import {
  useEffect,
  useState,
} from 'react'

import Header from '../components/Header'
import BottomMenu from '../components/BottomMenu'
import CartItem from '../components/CartItem'

import '../styles/Cesta.css'


function Cesta() {
  const [cesta, setCesta] = useState([])

  const telefoneWhatsApp = '5544998125510'


  useEffect(() => {
    try {
      const cestaSalva =
        JSON.parse(
          localStorage.getItem('cesta')
        ) || []

      setCesta(
        Array.isArray(cestaSalva)
          ? cestaSalva
          : []
      )
    } catch {
      localStorage.removeItem('cesta')
      setCesta([])
    }
  }, [])


  function atualizarCesta(novaCesta) {
    setCesta(novaCesta)

    localStorage.setItem(
      'cesta',
      JSON.stringify(novaCesta)
    )

    window.dispatchEvent(
      new Event('cestaAtualizada')
    )
  }


  function removerProduto(id) {
    const novaCesta =
      cesta.filter(
        (produto) =>
          produto.id !== id
      )

    atualizarCesta(novaCesta)
  }


  function aumentarQuantidade(id) {
    const novaCesta =
      cesta.map((produto) => {
        if (produto.id !== id) {
          return produto
        }

        const estoque =
          Number(produto.estoque)

        const quantidadeAtual =
          Number(
            produto.quantidadeCesta
          ) || 1

        if (
          Number.isFinite(estoque) &&
          quantidadeAtual >= estoque
        ) {
          alert(
            'Quantidade máxima disponível em estoque atingida.'
          )

          return produto
        }

        return {
          ...produto,
          quantidadeCesta:
            quantidadeAtual + 1,
        }
      })

    atualizarCesta(novaCesta)
  }


  function diminuirQuantidade(id) {
    const novaCesta =
      cesta.map((produto) => {
        if (produto.id !== id) {
          return produto
        }

        const quantidadeAtual =
          Number(
            produto.quantidadeCesta
          ) || 1

        if (quantidadeAtual <= 1) {
          return produto
        }

        return {
          ...produto,
          quantidadeCesta:
            quantidadeAtual - 1,
        }
      })

    atualizarCesta(novaCesta)
  }


  const total =
    cesta.reduce(
      (soma, produto) => {
        const preco =
          Number(produto.preco) || 0

        const quantidade =
          Number(
            produto.quantidadeCesta
          ) || 0

        return (
          soma +
          preco * quantidade
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
        const preco =
          Number(produto.preco) || 0

        const quantidade =
          Number(
            produto.quantidadeCesta
          ) || 0

        const subtotal =
          preco * quantidade

        const subtotalFormatado =
          subtotal
            .toFixed(2)
            .replace('.', ',')

        return (
          `• ${quantidade}x ${produto.nome}` +
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
      `Total: R$ ${totalFormatado}`,
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
          {cesta.length > 0 ? (
            cesta.map((produto) => (
              <CartItem
                key={produto.id}
                produto={produto}
                removerProduto={
                  removerProduto
                }
                aumentarQuantidade={
                  aumentarQuantidade
                }
                diminuirQuantidade={
                  diminuirQuantidade
                }
              />
            ))
          ) : (
            <div className="cesta-vazia">
              <p>
                Sua cesta está vazia.
              </p>
            </div>
          )}


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