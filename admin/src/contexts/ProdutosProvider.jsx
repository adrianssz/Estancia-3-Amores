import { useState } from 'react'

import produtosIniciais from '../data/produtos'
import ProdutosContext from './ProdutosContext'

function ProdutosProvider({ children }) {
  const [produtos, setProdutos] = useState(
    produtosIniciais
  )

  function adicionarProduto(novoProduto) {
    setProdutos((produtosAtuais) => [
      ...produtosAtuais,
      novoProduto,
    ])
  }

  function editarProduto(id, dadosAtualizados) {
    setProdutos((produtosAtuais) =>
      produtosAtuais.map((produto) =>
        produto.id === id
          ? {
              ...produto,
              ...dadosAtualizados,
            }
          : produto
      )
    )
  }

  function excluirProduto(id) {
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