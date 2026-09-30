import {
  useEffect,
  useState,
} from 'react'

import { supabase } from '../services/supabase'
import AuthContext from './AuthContext'

const USUARIO_ADMIN = 'operador00'

function classificarErroAutenticacao(error) {
  const codigo = String(
    error?.code ?? ''
  ).toLowerCase()

  const mensagem = String(
    error?.message ?? ''
  ).toLowerCase()

  const status = Number(
    error?.status ?? 0
  )

  if (
    codigo === 'invalid_credentials'
    || mensagem.includes(
      'invalid login credentials'
    )
  ) {
    return 'credenciais_invalidas'
  }

  if (
    status >= 500
    || mensagem.includes('service unavailable')
    || mensagem.includes('bad gateway')
    || mensagem.includes('gateway timeout')
  ) {
    return 'servico_indisponivel'
  }

  if (
    mensagem.includes('failed to fetch')
    || mensagem.includes('fetch failed')
    || mensagem.includes('network')
    || mensagem.includes('load failed')
  ) {
    return 'rede'
  }

  return 'autenticacao'
}

function AuthProvider({ children }) {
  const [autenticado, setAutenticado] =
    useState(false)

  const [
    usuarioAutenticado,
    setUsuarioAutenticado,
  ] = useState(null)

  const [carregando, setCarregando] =
    useState(true)

  useEffect(() => {
    let ativo = true

    async function carregarSessao() {
      try {
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
      } catch {
        if (!ativo) {
          return
        }

        setAutenticado(false)
        setUsuarioAutenticado(null)
      } finally {
        if (ativo) {
          setCarregando(false)
        }
      }
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
    const usuarioNormalizado =
      usuario.trim()

    if (
      usuarioNormalizado !==
      USUARIO_ADMIN
    ) {
      return {
        sucesso: false,
        motivo: 'credenciais_invalidas',
      }
    }

    const emailAdministrador =
      import.meta.env.VITE_SUPABASE_ADMIN_EMAIL

    if (!emailAdministrador) {
      return {
        sucesso: false,
        motivo: 'configuracao',
      }
    }

    try {
      const {
        data,
        error,
      } = await supabase.auth.signInWithPassword({
        email: emailAdministrador,
        password: senha,
      })

      if (error) {
        return {
          sucesso: false,
          motivo:
            classificarErroAutenticacao(
              error
            ),
        }
      }

      if (!data.session) {
        return {
          sucesso: false,
          motivo: 'autenticacao',
        }
      }

      setAutenticado(true)

      setUsuarioAutenticado(
        usuarioNormalizado
      )

      return {
        sucesso: true,
        motivo: null,
      }
    } catch (error) {
      return {
        sucesso: false,
        motivo:
          classificarErroAutenticacao(
            error
          ),
      }
    }
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