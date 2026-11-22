import {
  createContext,
  useContext,
} from 'react'

const pedidosContext = createContext(null)

// Dá acesso aos pedidos e às funções de cadastro, edição e exclusão.
function usePedidos() {
  const context = useContext(pedidosContext)

  if (!context) {
    throw new Error(
      'usePedidos deve ser utilizado dentro de PedidosProvider'
    )
  }

  return context
}

export { usePedidos }
export default pedidosContext