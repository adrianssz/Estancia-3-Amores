import '../styles/VisitMap.css'


function VisitMap() {

  const mapaUrl =
    'https://maps.app.goo.gl/s7JwjgHhYp22uj2j8'


  function abrirMapa(event) {

    event.preventDefault()

    try {

      const novaJanela = window.open(
        mapaUrl,
        '_blank',
        'noopener,noreferrer'
      )

      if (!novaJanela) {
        alert('Não foi possível abrir a localização')
      }

    } catch {

      alert('Não foi possível abrir a localização')

    }

  }


  return (
    <section className="visit-map">

      <h2 className="visit-map-title">
        Localização
      </h2>

      <a
        href={mapaUrl}
        className="visit-map-link"
        onClick={abrirMapa}
        aria-label="Abrir localização da Estância 3 Amores no Google Maps"
      >
        <div className="visit-map-box">

          <span className="visit-map-icon">
            📍
          </span>

          <span className="visit-map-text">
            Ver localização da Estância
          </span>

          <span className="visit-map-helper">
            Abrir no Google Maps
          </span>

        </div>
      </a>

    </section>
  )
}


export default VisitMap