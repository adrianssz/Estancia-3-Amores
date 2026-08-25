import { useState } from 'react'

import Header from '../components/Header'
import BottomMenu from '../components/BottomMenu'
import CategoryFilter from '../components/CategoryFilter'
import ProductCardFeira from '../components/ProductCardFeira'

import produtos from '../data/produtos'

import '../styles/Feira.css'


function Feira() {

  const [filtros, setFiltros] = useState({
    graos: false,
    legumes: false,
    verduras: false,
    frutas: false,
    colhidas: false,
    emCrescimento: false
  })


  function alternarFiltro(nomeFiltro) {

    setFiltros((estadoAtual) => ({
      ...estadoAtual,
      [nomeFiltro]: !estadoAtual[nomeFiltro]
    }))

  }


  const produtosValidos =
    produtos.filter((produto) => {

      return (
        produto.nome &&
        produto.preco !== null &&
        produto.preco !== undefined
      )

    })


  const categoriasSelecionadas = []


  if (filtros.graos) {
    categoriasSelecionadas.push('Grãos')
  }

  if (filtros.legumes) {
    categoriasSelecionadas.push('Legumes')
  }

  if (filtros.verduras) {
    categoriasSelecionadas.push('Verduras')
  }

  if (filtros.frutas) {
    categoriasSelecionadas.push('Frutas')
  }


  const statusSelecionados = []


  if (filtros.colhidas) {
    statusSelecionados.push('pronta-entrega')
  }

  if (filtros.emCrescimento) {
    statusSelecionados.push('em-crescimento')
  }


  const produtosFiltrados =
    produtosValidos.filter((produto) => {

      const categoriaValida =
        categoriasSelecionadas.length === 0 ||
        categoriasSelecionadas.includes(
          produto.categoria
        )


      const statusValido =
        statusSelecionados.length === 0 ||
        statusSelecionados.includes(
          produto.status
        )


      return (
        categoriaValida &&
        statusValido
      )

    })


  const prontaEntrega =
    produtosFiltrados.filter(
      produto =>
        produto.status === 'pronta-entrega'
    )


  const emCrescimento =
    produtosFiltrados.filter(
      produto =>
        produto.status === 'em-crescimento'
    )


  const nenhumProduto =
    produtosFiltrados.length === 0


  return (

    <>

      <Header />


      <main className="feira-page">

        <h1 className="feira-title">
          Produtos
        </h1>


        <CategoryFilter
          filtros={filtros}
          alternarFiltro={alternarFiltro}
        />


        {
          nenhumProduto

            ?

            <p className="sem-produtos">
              Não existem produtos disponíveis nesta categoria
            </p>

            :

            <>

              {
                prontaEntrega.length > 0 &&

                <section className="feira-section">

                  <h2>
                    Pronta Entrega
                  </h2>


                  <div className="feira-grid">

                    {
                      prontaEntrega.map((produto) => (

                        <ProductCardFeira
                          key={produto.id}
                          produto={produto}
                        />

                      ))
                    }

                  </div>

                </section>
              }


              {
                emCrescimento.length > 0 &&

                <section className="feira-section">

                  <h2>
                    Em Crescimento
                  </h2>


                  <div className="feira-grid">

                    {
                      emCrescimento.map((produto) => (

                        <ProductCardFeira
                          key={produto.id}
                          produto={produto}
                        />

                      ))
                    }

                  </div>

                </section>
              }

            </>
        }

      </main>


      <BottomMenu />

    </>

  )

}


export default Feira