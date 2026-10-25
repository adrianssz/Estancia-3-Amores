import { FiArrowUpRight, FiMapPin } from 'react-icons/fi'

// As coordenadas vêm do link do Google Maps já usado pelo projeto.
const mapaEmbed = 'https://maps.google.com/maps?q=-23.3599702%2C-53.280729&z=15&output=embed'
const mapaUrl = 'https://maps.app.goo.gl/s7JwjgHhYp22uj2j8'

// Mostra o mapa interativo e mantém um link direto para abrir a rota.
function LocationMap({ title = 'Nossa localização' }) {
  return (
    <section className="location-section">
      <div className="location-heading">
        <div>
          <span className="section-eyebrow"><FiMapPin aria-hidden="true" /> Encontre a Estância</span>
          <h2>{title}</h2>
        </div>
        <a href={mapaUrl} target="_blank" rel="noopener noreferrer" className="location-directions">
          Abrir rota <FiArrowUpRight aria-hidden="true" />
        </a>
      </div>

      <div className="location-frame">
        <iframe
          title="Mapa da Estância 3 Amores no Google Maps"
          src={mapaEmbed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </section>
  )
}

export default LocationMap
