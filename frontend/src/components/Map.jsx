import { FaMapMarkerAlt } from 'react-icons/fa'

import '../styles/Map.css'


function Map() {

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
    <section className="map-section">

      <h2 className="map-title">
        Nossa localização
      </h2>

      <a
        href={mapaUrl}
        className="map-link"
        onClick={abrirMapa}
        aria-label="Abrir localização da Estância 3 Amores no Google Maps"
      >

        <div className="map-box">

          <FaMapMarkerAlt
            className="map-icon"
          />

          <strong className="map-text">
            Estância 3 Amores
          </strong>

          <span className="map-helper">
            Abrir localização no Google Maps
          </span>

        </div>

      </a>

    </section>
  )
}


export default Map