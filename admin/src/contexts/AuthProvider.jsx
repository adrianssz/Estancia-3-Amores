import { useState } from 'react'

import AuthContext from './AuthContext'

const USUARIO_TEMPORARIO = 'operador00'
const SENHA_TEMPORARIA = 'admin123'

function AuthProvider({ children }) {
  const [autenticado, setAutenticado] = useState(false)
  const [usuarioAutenticado, setUsuarioAutenticado] =
    useState(null)

  function entrar(usuario, senha) {
    const credenciaisValidas =
      usuario === USUARIO_TEMPORARIO &&
      senha === SENHA_TEMPORARIA

    if (!credenciaisValidas) {
      return false
    }

    setAutenticado(true)
    setUsuarioAutenticado(usuario)

    return true
  }

  function sair() {
    setAutenticado(false)
    setUsuarioAutenticado(null)
  }

  return (
    <AuthContext.Provider
      value={{
        autenticado,
        usuarioAutenticado,
        entrar,
        sair,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider