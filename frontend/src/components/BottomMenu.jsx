import { Link } from 'react-router-dom'
import '../styles/BottomMenu.css'


function BottomMenu() {

  return (

    <nav className="bottom-menu">

      <Link to="/">
        🏠
        <span>
          Home
        </span>
      </Link>


      <Link to="/feira">
        🛒
        <span>
          Feira
        </span>
      </Link>


      <Link to="/sobre">
        ℹ️
        <span>
          Sobre
        </span>
      </Link>


      <Link to="/contato">
        💬
        <span>
          Contato
        </span>
      </Link>


    </nav>

  )

}


export default BottomMenu