import { Link, NavLink } from 'react-router-dom'

import { useAuth } from '../contexts/AuthContext'

// Exibe a navegação do painel e o botão de saída da sessão.
function Header() {
  const { sair } = useAuth()

  return (
    <header className="admin-header">
      <Link
        to="/dashboard"
        className="admin-header__logo"
        aria-label="Estância 3 Amores, dashboard"
      >
        <img src="/logo-estancia.png" alt="" />
      </Link>

      <nav className="admin-header__nav">
        <NavLink
          to="/plantios"
          className="admin-header__link"
        >
          Plantio
        </NavLink>

        <NavLink
          to="/produtos"
          className="admin-header__link"
        >
          Produtos
        </NavLink>

        <NavLink
          to="/clientes"
          className="admin-header__link"
        >
          Clientes
        </NavLink>

        <NavLink
          to="/entregas"
          className="admin-header__link"
        >
          Entregas
        </NavLink>

        <NavLink
          to="/relatorios"
          className="admin-header__link"
        >
          Relatórios
        </NavLink>

        <button
          type="button"
          className="admin-header__logout"
          onClick={sair}
        >
          Sair
        </button>
      </nav>
    </header>
  )
}

export default Header
