import {
  Navigate,
  Outlet,
} from 'react-router-dom'

import { useAuth } from '../contexts/AuthContext'

// Aguarda a sessão e manda para o login quem não está autenticado.
function ProtectedRoute() {
  const {
    autenticado,
    carregando,
  } = useAuth()

  if (carregando) {
    return null
  }

  if (!autenticado) {
    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }

  return <Outlet />
}

export default ProtectedRoute