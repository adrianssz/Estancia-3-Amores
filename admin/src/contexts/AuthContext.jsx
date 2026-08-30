import {
  createContext,
  useContext,
} from 'react'

const authContext = createContext(null)

function useAuth() {
  const context = useContext(authContext)

  if (!context) {
    throw new Error(
      'useAuth deve ser utilizado dentro de AuthProvider'
    )
  }

  return context
}

export { useAuth }
export default authContext