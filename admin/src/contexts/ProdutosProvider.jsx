import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import { supabase } from '../services/supabase'
import ProdutosContext from './ProdutosContext'

async function buscarProdutos() {
  const { data, error } = await supabase
    .from('produtos')
    .select('*')
    .order('id', { ascending: true })

  if (error) {
    throw error
  }

  return data ?? []
}

function ProdutosProvider({ children }) {
  const [produtos, setProdutos] = useState([])
  const [carregandoProdutos, setCarregandoProdutos] =
    useState(true)
  const [erroProdutos, setErroProdutos] = useState('')

  const carregarProdutos = useCallback(async () => {
    setCarregandoProdutos(true)
    setErroProdutos('')

    try {
      const dados = await buscarProdutos()

      setProdutos(dados)
    } catch (error) {
      console.error(
        'Erro ao carregar produtos:',
        error
      )

      setProdutos([])
      setErroProdutos(
        'Não foi possível carregar os produtos.'
      )
    } finally {
      setCarregandoProdutos(false)
    }
  }, [])

  useEffect(() => {
    let ativo = true

    buscarProdutos()
      .then((dados) => {
        if (!ativo) {
          return
        }

        setProdutos(dados)
        setCarregandoProdutos(false)
      })
      .catch((error) => {
        if (!ativo) {
          return
        }

        console.error(
          'Erro ao carregar produtos:',
          error
        )

        setProdutos([])
        setErroProdutos(
          'Não foi possível carregar os produtos.'
        )
        setCarregandoProdutos(false)
      })

    return () => {
      ativo = false
    }
  }, [])

  async function adicionarProduto(novoProduto) {
    const dadosProduto = {
      nome: novoProduto.nome,
      unidade: novoProduto.unidade,
      preco: novoProduto.preco,
      categoria: novoProduto.categoria,
      status: novoProduto.status,
      estoque: novoProduto.estoque,
      imagem: novoProduto.imagem,
    }

    const { data, error } = await supabase
      .from('produtos')
      .insert(dadosProduto)
      .select('*')
      .single()

    if (error) {
      throw error
    }

    setProdutos((produtosAtuais) => [
      ...produtosAtuais,
      data,
    ])

    return data
  }

  async function editarProduto(id, dadosAtualizados) {
    const dadosProduto = {
      nome: dadosAtualizados.nome,
      unidade: dadosAtualizados.unidade,
      preco: dadosAtualizados.preco,
      categoria: dadosAtualizados.categoria,
      status: dadosAtualizados.status,
      estoque: dadosAtualizados.estoque,
      imagem: dadosAtualizados.imagem,
    }

    const { data, error } = await supabase
      .from('produtos')
      .update(dadosProduto)
      .eq('id', id)
      .select('*')
      .single()

    if (error) {
      throw error
    }

    setProdutos((produtosAtuais) =>
      produtosAtuais.map((produto) =>
        produto.id === id
          ? data
          : produto
      )
    )

    return data
  }

  async function excluirProduto(id) {
    const { error } = await supabase
      .from('produtos')
      .delete()
      .eq('id', id)

    if (error) {
      throw error
    }

    setProdutos((produtosAtuais) =>
      produtosAtuais.filter(
        (produto) => produto.id !== id
      )
    )
  }

  return (
    <ProdutosContext.Provider
      value={{
        produtos,
        carregandoProdutos,
        erroProdutos,
        carregarProdutos,
        adicionarProduto,
        editarProduto,
        excluirProduto,
      }}
    >
      {children}
    </ProdutosContext.Provider>
  )
}

export default ProdutosProvider