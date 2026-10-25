import { FaInstagram, FaWhatsapp } from 'react-icons/fa'
import { FiArrowUpRight, FiMapPin } from 'react-icons/fi'
import Header from '../components/Header'
import BottomMenu from '../components/BottomMenu'
import LocationMap from '../components/LocationMap'

// Reúne canais oficiais e a localização em uma página fácil de explorar.
function Contato() {
  const whatsappUrl = 'https://wa.me/5544998125510'
  const instagramUrl = 'https://www.instagram.com/estancia_3_amores/'
  const mapaUrl = 'https://maps.app.goo.gl/s7JwjgHhYp22uj2j8'

  return (
    <>
      <Header />

      <main className="contato-page">
        <div className="contact-intro">
          <span className="section-eyebrow">Estamos por perto</span>
          <h1 className="contato-title">Vamos <em>conversar?</em></h1>
          <p>Fale com a Estância, acompanhe as novidades do campo ou planeje sua visita.</p>
        </div>

        <section className="contact-grid" aria-label="Canais de contato">
          <a className="contact-card contact-card-featured" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <span className="contact-card-icon"><FaWhatsapp aria-hidden="true" /></span>
            <span className="contact-card-copy">
              <small>Converse com a gente</small>
              <strong>WhatsApp</strong>
              <span>Entre em contato para tirar suas dúvidas.</span>
            </span>
            <FiArrowUpRight className="contact-card-arrow" aria-hidden="true" />
          </a>

          <a className="contact-card" href={instagramUrl} target="_blank" rel="noopener noreferrer">
            <span className="contact-card-icon"><FaInstagram aria-hidden="true" /></span>
            <span className="contact-card-copy">
              <small>Acompanhe o dia a dia</small>
              <strong>Instagram</strong>
              <span>Veja as novidades da Estância.</span>
            </span>
            <FiArrowUpRight className="contact-card-arrow" aria-hidden="true" />
          </a>

          <a className="contact-card" href={mapaUrl} target="_blank" rel="noopener noreferrer">
            <span className="contact-card-icon"><FiMapPin aria-hidden="true" /></span>
            <span className="contact-card-copy">
              <small>Venha nos conhecer</small>
              <strong>Como chegar</strong>
              <span>Abra o trajeto no Google Maps.</span>
            </span>
            <FiArrowUpRight className="contact-card-arrow" aria-hidden="true" />
          </a>
        </section>

        <LocationMap title="Encontre a Estância" />
      </main>

      <BottomMenu />
    </>
  )
}

export default Contato
