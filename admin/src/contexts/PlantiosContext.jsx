import {
  createContext,
  useContext,
} from 'react'

const plantiosContext = createContext(null)

// Dá acesso aos plantios e às funções do PlantiosProvider.
function usePlantios() {
  const context = useContext(plantiosContext)

  if (!context) {
    throw new Error(
      'usePlantios deve ser utilizado dentro de PlantiosProvider'
    )
  }

  return context
}

export { usePlantios }
export default plantiosContext