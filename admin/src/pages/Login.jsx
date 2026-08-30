import { useState } from 'react'
import {
  Navigate,
  useNavigate,
} from 'react-router-dom'

import { useAuth } from '../contexts/AuthContext'
import '../styles/Login.css'

function Login() {
  const navigate = useNavigate()

  const {
    autenticado,
    entrar,
  } = useAuth()

  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')

  function handleUsuarioChange(event) {
    setUsuario(event.target.value)
    setErro('')
  }

  function handleSenhaChange(event) {
    setSenha(event.target.value)
    setErro('')
  }

  function handleSubmit(event) {
    event.preventDefault()

    const usuarioNormalizado = usuario.trim()

    if (!usuarioNormalizado) {
      setErro('O campo Usuário é obrigatório')
      return
    }

    const loginRealizado = entrar(
      usuarioNormalizado,
      senha
    )

    if (!loginRealizado) {
      setErro('Senha incorreta! Tente novamente.')
      return
    }

    setErro('')

    navigate(
      '/dashboard',
      {
        replace: true,
      }
    )
  }

  if (autenticado) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    )
  }

  return (
    <main className="login-page">
      <section className="login-card">
        {erro && (
          <div
            className="login-alert"
            role="alert"
            aria-live="polite"
          >
            {erro}
          </div>
        )}

        <div
          className="login-logo"
          aria-label="Logo Estância 3 Amores"
        >
          Logo
        </div>

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >
          <div className="login-form__grupo">
            <label htmlFor="usuario">
              Usuário
            </label>

            <input
              id="usuario"
              type="text"
              value={usuario}
              onChange={handleUsuarioChange}
              placeholder="Usuário"
              autoComplete="username"
            />
          </div>

          <div className="login-form__grupo">
            <label htmlFor="senha">
              Senha
            </label>

            <input
              id="senha"
              type="password"
              value={senha}
              onChange={handleSenhaChange}
              placeholder="Senha"
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="login-form__entrar"
          >
            Entrar
          </button>
        </form>
      </section>
    </main>
  )
}

export default Login