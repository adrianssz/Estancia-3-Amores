import {
  useEffect,
  useState,
} from 'react'

import Header from '../components/Header'
import BottomMenu from '../components/BottomMenu'
import CategoryFilter from '../components/CategoryFilter'
import ProductCardFeira from '../components/ProductCardFeira'

import { supabase } from '../services/supabase'

import '../styles/Feira.css'

function Feira() {
  const [produtos, setProdutos] = useState([])

  const [carregandoProdutos, setCarregandoProdutos] =
    useState(true)

  const [erroProdutos, setErroProdutos] =
    useState('')

  const [filtros, setFiltros] = useState({
    graos: false,
    legumes: false,
    verduras: false,
    frutas: false,
    colhidas: false,
    emCrescimento: false,
  })

  useEffect(() => {
    let ativo = true

    async function carregarProdutos() {
      setCarregandoProdutos(true)
      setErroProdutos('')

      const { data, error } = await supabase
        .from('vw_produtos_mais_vendidos')
        .select(`
          id,
          nome,
          unidade,
          preco,
          categoria,
          status,
          estoque,
          imagem
        `)
        .order('nome', {
          ascending: true,
        })

      if (!ativo) {
        return
      }

      if (error) {
        console.error(
          'Erro ao carregar produtos da Feira:',
          error
        )

        setProdutos([])
        setErroProdutos(
          'Não foi possível carregar os produtos.'
        )
        setCarregandoProdutos(false)
        return
      }

      const produtosNormalizados = (data ?? []).map(
        (produto) => ({
          ...produto,
          preco: Number(produto.preco),
          estoque: Number(produto.estoque),
          imagem: produto.imagem || '',
        })
      )

      setProdutos(produtosNormalizados)
      setCarregandoProdutos(false)
    }

    carregarProdutos()

    return () => {
      ativo = false
    }
  }, [])

  function alternarFiltro(nomeFiltro) {
    setFiltros((estadoAtual) => ({
      ...estadoAtual,
      [nomeFiltro]: !estadoAtual[nomeFiltro],
    }))
  }

  const produtosValidos = produtos.filter(
    (produto) =>
      produto.nome &&
      Number.isFinite(produto.preco) &&
      Number.isFinite(produto.estoque)
  )

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

      return categoriaValida && statusValido
    })

  const prontaEntrega =
    produtosFiltrados.filter(
      (produto) =>
        produto.status === 'pronta-entrega'
    )

  const emCrescimento =
    produtosFiltrados.filter(
      (produto) =>
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

        {carregandoProdutos && (
          <p className="sem-produtos">
            Carregando produtos...
          </p>
        )}

        {erroProdutos && (
          <p
            className="sem-produtos"
            role="alert"
          >
            {erroProdutos}
          </p>
        )}

        {!carregandoProdutos &&
          !erroProdutos &&
          nenhumProduto && (
            <p className="sem-produtos">
              Não existem produtos disponíveis nesta categoria
            </p>
          )}

        {!carregandoProdutos &&
          !erroProdutos &&
          !nenhumProduto && (
            <>
              {prontaEntrega.length > 0 && (
                <section className="feira-section">
                  <h2>
                    Pronta Entrega
                  </h2>

                  <div className="feira-grid">
                    {prontaEntrega.map(
                      (produto) => (
                        <ProductCardFeira
                          key={produto.id}
                          produto={produto}
                        />
                      )
                    )}
                  </div>
                </section>
              )}

              {emCrescimento.length > 0 && (
                <section className="feira-section">
                  <h2>
                    Em Crescimento
                  </h2>

                  <div className="feira-grid">
                    {emCrescimento.map(
                      (produto) => (
                        <ProductCardFeira
                          key={produto.id}
                          produto={produto}
                        />
                      )
                    )}
                  </div>
                </section>
              )}
            </>
          )}
      </main>

      <BottomMenu />
    </>
  )
}

export default Feira