import {
  useEffect,
  useState,
} from 'react'

import Header from '../components/Header'
import Banner from '../components/Banner'
import ProductCard from '../components/ProductCard'
import Map from '../components/Map'
import BottomMenu from '../components/BottomMenu'

import { supabase } from '../services/supabase'

import '../styles/Home.css'

function Home() {
  const [produtosDestaque, setProdutosDestaque] =
    useState([])

  const [carregandoDestaques, setCarregandoDestaques] =
    useState(true)

  const [erroDestaques, setErroDestaques] =
    useState('')

  useEffect(() => {
    let ativo = true

    async function carregarDestaques() {
      setCarregandoDestaques(true)
      setErroDestaques('')

      const { data, error } = await supabase
        .from('vw_produtos_mais_vendidos')
        .select(`
          id,
          nome,
          preco,
          imagem,
          total_vendido
        `)
        .order('total_vendido', {
          ascending: false,
        })
        .order('id', {
          ascending: true,
        })
        .limit(4)

      if (!ativo) {
        return
      }

      if (error) {
        console.error(
          'Erro ao carregar produtos em destaque:',
          error
        )

        setProdutosDestaque([])
        setErroDestaques(
          'Não foi possível carregar os produtos em destaque.'
        )
        setCarregandoDestaques(false)
        return
      }

      setProdutosDestaque(data ?? [])
      setCarregandoDestaques(false)
    }

    carregarDestaques()

    return () => {
      ativo = false
    }
  }, [])

  function formatarPreco(preco) {
    const valor = Number(preco)

    if (!Number.isFinite(valor)) {
      return '0,00'
    }

    return valor.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  return (
    <>
      <Header />

      <main className="home-page">
        <Banner />

        <div className="home-content">
          <section>
            <h2 className="home-section-title">
              Destaques
            </h2>

            {carregandoDestaques && (
              <p>
                Carregando produtos em destaque...
              </p>
            )}

            {erroDestaques && (
              <p role="alert">
                {erroDestaques}
              </p>
            )}

            {!carregandoDestaques &&
              !erroDestaques &&
              produtosDestaque.length === 0 && (
                <p>
                  Nenhum produto disponível no momento.
                </p>
              )}

            {!carregandoDestaques &&
              !erroDestaques &&
              produtosDestaque.length > 0 && (
                <div className="home-products-grid">
                  {produtosDestaque.map((produto) => (
                    <ProductCard
                      key={produto.id}
                      imagem={produto.imagem}
                      nome={produto.nome}
                      preco={formatarPreco(
                        produto.preco
                      )}
                    />
                  ))}
                </div>
              )}
          </section>

          <Map />
        </div>
      </main>

      <BottomMenu />
    </>
  )
}

export default Home