import { NavLink } from 'react-router-dom'
import { FiHome, FiShoppingBag, FiHeart, FiMessageCircle } from 'react-icons/fi'


// Exibe os atalhos de navegação no menu inferior do site.
function BottomMenu() {

  return (

    <nav className="bottom-menu">

      <NavLink to="/" end>
        <FiHome aria-hidden="true" />
        <span>
          Home
        </span>
      </NavLink>


      <NavLink to="/feira">
        <FiShoppingBag aria-hidden="true" />
        <span>
          Feira
        </span>
      </NavLink>


      <NavLink to="/sobre">
        <FiHeart aria-hidden="true" />
        <span>
          Sobre
        </span>
      </NavLink>


      <NavLink to="/contato">
        <FiMessageCircle aria-hidden="true" />
        <span>
          Contato
        </span>
      </NavLink>


    </nav>

  )

}


export default BottomMenu
