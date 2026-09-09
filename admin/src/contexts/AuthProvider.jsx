import {
  useEffect,
  useState,
} from 'react'

import { supabase } from '../services/supabase'
import AuthContext from './AuthContext'

const USUARIO_ADMIN = 'operador00'

function AuthProvider({ children }) {
  const [autenticado, setAutenticado] = useState(false)

  const [usuarioAutenticado, setUsuarioAutenticado] =
    useState(null)

  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    let ativo = true

    async function carregarSessao() {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!ativo) {
        return
      }

      setAutenticado(Boolean(session))

      setUsuarioAutenticado(
        session
          ? USUARIO_ADMIN
          : null
      )

      setCarregando(false)
    }

    carregarSessao()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_evento, session) => {
        if (!ativo) {
          return
        }

        setAutenticado(Boolean(session))

        setUsuarioAutenticado(
          session
            ? USUARIO_ADMIN
            : null
        )

        setCarregando(false)
      }
    )

    return () => {
      ativo = false
      subscription.unsubscribe()
    }
  }, [])

  async function entrar(usuario, senha) {
    const usuarioNormalizado = usuario.trim()

    if (usuarioNormalizado !== USUARIO_ADMIN) {
      return false
    }

    const emailAdministrador =
      import.meta.env.VITE_SUPABASE_ADMIN_EMAIL

    if (!emailAdministrador) {
      return false
    }

    const {
      data,
      error,
    } = await supabase.auth.signInWithPassword({
      email: emailAdministrador,
      password: senha,
    })

    if (error || !data.session) {
      return false
    }

    setAutenticado(true)
    setUsuarioAutenticado(usuarioNormalizado)

    return true
  }

  async function sair() {
    await supabase.auth.signOut()

    setAutenticado(false)
    setUsuarioAutenticado(null)
  }

  return (
    <AuthContext.Provider
      value={{
        autenticado,
        usuarioAutenticado,
        carregando,
        entrar,
        sair,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider