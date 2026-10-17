import {
  createContext,
  useContext,
} from 'react'

const entregasContext = createContext(null)

// Dá acesso às entregas e às funções do EntregasProvider.
function useEntregas() {
  const context = useContext(entregasContext)

  if (!context) {
    throw new Error(
      'useEntregas deve ser utilizado dentro de EntregasProvider'
    )
  }

  return context
}

export { useEntregas }
export default entregasContext