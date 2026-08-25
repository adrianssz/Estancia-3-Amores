import { Link, NavLink } from 'react-router-dom'
import '../styles/Header.css'

function Header() {
  return (
    <header className="admin-header">
      <Link
        to="/dashboard"
        className="admin-header__logo"
      >
        Logo
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
      </nav>
    </header>
  )
}

export default Header