import Header from '../components/Header'
import BottomMenu from '../components/BottomMenu'

import {
  FaWhatsapp,
  FaInstagram,
  FaMap,
  FaMapMarkerAlt
} from 'react-icons/fa'

import '../styles/Contato.css'


function Contato() {

  const telefoneWhatsApp = '5511999999999'

  const instagramUrl =
    'https://www.instagram.com/'

  const endereco =
    'Estrada x Fazenda Y'

  const mapaUrl =
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}`


  function abrirLink(url, mensagemErro) {

    try {

      const novaJanela = window.open(
        url,
        '_blank',
        'noopener,noreferrer'
      )

      if (!novaJanela) {
        alert(mensagemErro)
      }

    } catch (erro) {

      alert(mensagemErro)

    }

  }


  function abrirWhatsApp(event) {

    event.preventDefault()

    const whatsappUrl =
      `https://wa.me/${telefoneWhatsApp}`

    abrirLink(
      whatsappUrl,
      'Serviço temporariamente indisponível'
    )

  }


  function abrirInstagram(event) {

    event.preventDefault()

    abrirLink(
      instagramUrl,
      'Serviço temporariamente indisponível'
    )

  }


  function abrirMapa(event) {

    event.preventDefault()

    abrirLink(
      mapaUrl,
      'Não foi possível abrir o mapa'
    )

  }


  return (
    <>
      <Header />


      <main className="contato-page">

        <h1 className="contato-title">
          Contato
        </h1>


        <section className="contato-box">

          <a
            href={`https://wa.me/${telefoneWhatsApp}`}
            className="contato-link"
            onClick={abrirWhatsApp}
            aria-label="Entrar em contato pelo WhatsApp"
          >
            <FaWhatsapp
              className="contato-icon"
            />
          </a>


          <a
            href={instagramUrl}
            className="contato-link"
            onClick={abrirInstagram}
            aria-label="Acessar Instagram"
          >
            <FaInstagram
              className="contato-icon"
            />
          </a>


          <a
            href={mapaUrl}
            className="contato-link"
            onClick={abrirMapa}
            aria-label="Abrir localização no mapa"
          >
            <FaMap
              className="contato-icon"
            />
          </a>


          <a
            href={mapaUrl}
            className="localizacao-area"
            onClick={abrirMapa}
            aria-label="Abrir endereço no mapa"
          >

            <FaMapMarkerAlt
              className="contato-icon"
            />

            <p className="contato-endereco">
              {endereco}
            </p>

          </a>

        </section>

      </main>


      <BottomMenu />
    </>
  )
}


export default Contato