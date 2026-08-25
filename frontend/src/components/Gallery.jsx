import '../styles/Gallery.css'


function Gallery() {

  const fotos = [
    {
      src: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399',
      alt: 'Imagem ilustrativa de área de cultivo'
    },
    {
      src: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854',
      alt: 'Imagem ilustrativa de plantação rural'
    },
    {
      src: 'https://images.unsplash.com/photo-1498579397066-22750a3cb424',
      alt: 'Imagem ilustrativa de produção agrícola'
    },
    {
      src: 'https://images.unsplash.com/photo-1461354464878-ad92f492a5a0',
      alt: 'Imagem ilustrativa de alimentos cultivados'
    }
  ]


  return (
    <section className="gallery">

      <h2 className="gallery-title">
        Fotos
      </h2>

      <div className="gallery-grid">

        {fotos.map((foto, index) => (
          <img
            key={index}
            src={foto.src}
            alt={foto.alt}
            loading="lazy"
            className="gallery-image"
          />
        ))}

      </div>

    </section>
  )
}


export default Gallery