
import { useEffect, useRef } from 'react'


// Exibe o banner informativo da Estância.
function Banner() {
  const videoRef = useRef(null)

  // Reproduz somente enquanto o banner está visível e a aba está ativa.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return undefined

    let visivel = false

    function sincronizarVideo() {
      if (visivel && !document.hidden) {
        video.play().catch(() => {})
      } else {
        video.pause()
      }
    }

    const observer = new IntersectionObserver(([entrada]) => {
      visivel = entrada.isIntersecting
      sincronizarVideo()
    }, { threshold: 0.05 })

    observer.observe(video)
    document.addEventListener('visibilitychange', sincronizarVideo)

    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', sincronizarVideo)
      video.pause()
    }
  }, [])

  // Reduz a opacidade aos poucos conforme o visitante desce a página.
  useEffect(() => {
    const banner = videoRef.current?.parentElement
    if (!banner) return undefined

    let frame = null

    function atualizarOpacidade() {
      frame = null
      const distancia = Math.max(banner.offsetHeight, 1)
      const progresso = Math.min(1, window.scrollY / distancia)
      banner.style.opacity = String(1 - progresso)
      banner.style.pointerEvents = progresso === 1 ? 'none' : ''
    }

    function aoRolar() {
      if (frame === null) frame = window.requestAnimationFrame(atualizarOpacidade)
    }

    atualizarOpacidade()
    window.addEventListener('scroll', aoRolar, { passive: true })

    return () => {
      window.removeEventListener('scroll', aoRolar)
      if (frame !== null) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <section className="banner">

      <div className="banner-container">

        <video
          ref={videoRef}
          className="banner-image"
          poster="/banner-estancia.jpg"
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="Plantação vista de cima com a marca Estância Três Amores"
        >
          <source src="/banner-estancia.mp4" type="video/mp4" />
        </video>

      </div>

    </section>
  )
}


export default Banner
