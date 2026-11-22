import {
  createContext,
  useContext,
} from 'react'

const clientesContext = createContext(null)

// Dá acesso aos clientes e às funções do ClientesProvider.
function useClientes() {
  const context = useContext(clientesContext)

  if (!context) {
    throw new Error(
      'useClientes deve ser utilizado dentro de ClientesProvider'
    )
  }

  return context
}

export { useClientes }
export default clientesContext