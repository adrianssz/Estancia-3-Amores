import {
  useEffect,
  useState
} from 'react'

import { Link } from 'react-router-dom'
import { FiShoppingBag } from 'react-icons/fi'



// Exibe o cabeçalho com acesso à cesta e contador de quantidades.
function Header() {

  const [compacto, setCompacto] = useState(false)

  const [
    quantidadeCesta,
    setQuantidadeCesta
  ] = useState(0)


  // Soma as quantidades dos produtos salvos na cesta do navegador.
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


  // Atualiza o contador ao carregar e acompanha mudanças na cesta.
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

  // A faixa de retorno evita oscilações perto do ponto de mudança.
  useEffect(() => {
    let frame = null

    function atualizarCabecalho() {
      frame = null
      setCompacto((anterior) => window.scrollY > (anterior ? 50 : 100))
    }

    function aoRolar() {
      if (frame === null) frame = window.requestAnimationFrame(atualizarCabecalho)
    }

    atualizarCabecalho()
    window.addEventListener('scroll', aoRolar, { passive: true })
    return () => {
      window.removeEventListener('scroll', aoRolar)
      if (frame !== null) window.cancelAnimationFrame(frame)
    }
  }, [])


  return (

    <header className={`header ${compacto ? 'header--compact' : ''}`}>

      <div className="header-surface">

      <Link
        to="/"
        className="header-logo"
        aria-label="Estância 3 Amores, início"
        aria-hidden={compacto ? true : undefined}
        tabIndex={compacto ? -1 : undefined}
      >
        <img src="/logo-estancia.png" className="brand-logo-image" alt="" />
      </Link>


      <Link
        to="/cesta"
        className="cart-button"
        aria-label="Abrir cesta"
      >

        <span className="cart-icon">
          <FiShoppingBag aria-hidden="true" />
        </span>


        {
          quantidadeCesta > 0 &&

          <span className="cart-counter">
            {quantidadeCesta}
          </span>
        }

      </Link>

      </div>

    </header>

  )

}


export default Header
