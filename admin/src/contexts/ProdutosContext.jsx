import {
  createContext,
  useContext,
} from 'react'

const produtosContext = createContext(null)

function useProdutos() {
  const context = useContext(produtosContext)

  if (!context) {
    throw new Error(
      'useProdutos deve ser utilizado dentro de ProdutosProvider'
    )
  }

  return context
}

export { useProdutos }
export default produtosContext