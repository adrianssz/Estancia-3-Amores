import {
  useEffect,
  useState
} from 'react'

import { Link } from 'react-router-dom'

import '../styles/Header.css'


function Header() {

  const [
    quantidadeCesta,
    setQuantidadeCesta
  ] = useState(0)


  function atualizarContador() {

    const cesta =
      JSON.parse(
        localStorage.getItem('cesta')
      ) || []


    const quantidadeTotal =
      cesta.reduce(
        (total, produto) => {

          return (
            total +
            (produto.quantidadeCesta || 0)
          )

        },
        0
      )


    setQuantidadeCesta(
      quantidadeTotal
    )

  }


  useEffect(() => {

    atualizarContador()


    window.addEventListener(
      'cestaAtualizada',
      atualizarContador
    )


    window.addEventListener(
      'storage',
      atualizarContador
    )


    return () => {

      window.removeEventListener(
        'cestaAtualizada',
        atualizarContador
      )


      window.removeEventListener(
        'storage',
        atualizarContador
      )

    }

  }, [])


  return (

    <header className="header">

      <div className="header-logo">
        LOGO
      </div>


      <Link
        to="/cesta"
        className="cart-button"
        aria-label="Abrir cesta"
      >

        <span className="cart-icon">
          🛒
        </span>


        {
          quantidadeCesta > 0 &&

          <span className="cart-counter">
            {quantidadeCesta}
          </span>
        }

      </Link>

    </header>

  )

}


export default Header