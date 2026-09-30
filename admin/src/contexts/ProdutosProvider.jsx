import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import { supabase } from '../services/supabase'
import {
  enviarImagemProduto,
  extrairCaminhoImagemProduto,
  removerImagemProduto,
} from '../services/imagensProdutos'
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

async function limparImagemSemUso(url) {
  if (!extrairCaminhoImagemProduto(url)) {
    return
  }

  try {
    const { data, error } = await supabase
      .from('produtos')
      .select('id')
      .eq('imagem', url)
      .limit(1)

    if (error) {
      throw error
    }

    if (data?.length) {
      return
    }

    await removerImagemProduto(url)
  } catch (error) {
    // Uma falha na limpeza não desfaz o produto já salvo.
    console.warn(
      'Não foi possível limpar a imagem sem uso:',
      error
    )
  }
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
    let imagemEnviada = ''

    if (novoProduto.arquivoImagem) {
      imagemEnviada = await enviarImagemProduto(
        novoProduto.arquivoImagem
      )
    }

    const dadosProduto = {
      nome: novoProduto.nome,
      unidade: novoProduto.unidade,
      preco: novoProduto.preco,
      categoria: novoProduto.categoria,
      status: novoProduto.status,
      estoque: novoProduto.estoque,
      imagem:
        imagemEnviada || novoProduto.imagem || '',
    }

    let produtoCriado

    try {
      const { data, error } = await supabase
        .from('produtos')
        .insert(dadosProduto)
        .select('*')
        .single()

      if (error) {
        throw error
      }

      produtoCriado = data
    } catch (error) {
      await limparImagemSemUso(imagemEnviada)
      throw error
    }

    setProdutos((produtosAtuais) => [
      ...produtosAtuais,
      produtoCriado,
    ])

    return produtoCriado
  }

  async function editarProduto(id, dadosAtualizados) {
    const {
      data: produtoAnterior,
      error: erroBusca,
    } = await supabase
      .from('produtos')
      .select('imagem')
      .eq('id', id)
      .single()

    if (erroBusca) {
      throw erroBusca
    }

    let imagemEnviada = ''

    if (dadosAtualizados.arquivoImagem) {
      imagemEnviada = await enviarImagemProduto(
        dadosAtualizados.arquivoImagem
      )
    }

    const dadosProduto = {
      nome: dadosAtualizados.nome,
      unidade: dadosAtualizados.unidade,
      preco: dadosAtualizados.preco,
      categoria: dadosAtualizados.categoria,
      status: dadosAtualizados.status,
      estoque: dadosAtualizados.estoque,
      imagem: imagemEnviada || (
        dadosAtualizados.imagem ??
        produtoAnterior.imagem ??
        ''
      ),
    }

    let produtoEditado

    try {
      const { data, error } = await supabase
        .from('produtos')
        .update(dadosProduto)
        .eq('id', id)
        .select('*')
        .single()

      if (error) {
        throw error
      }

      produtoEditado = data
    } catch (error) {
      await limparImagemSemUso(imagemEnviada)
      throw error
    }

    setProdutos((produtosAtuais) =>
      produtosAtuais.map((produto) =>
        produto.id === id
          ? produtoEditado
          : produto
      )
    )

    if (
      produtoAnterior.imagem !==
      produtoEditado.imagem
    ) {
      await limparImagemSemUso(
        produtoAnterior.imagem
      )
    }

    return produtoEditado
  }

  async function excluirProduto(id) {
    const { data, error } = await supabase
      .from('produtos')
      .delete()
      .eq('id', id)
      .select('id, imagem')
      .single()

    if (error) {
      throw error
    }

    setProdutos((produtosAtuais) =>
      produtosAtuais.filter(
        (produto) => produto.id !== id
      )
    )

    // Só tenta remover a foto após confirmar a exclusão.
    await limparImagemSemUso(data.imagem)
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