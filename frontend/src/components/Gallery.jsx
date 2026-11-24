const fotos = [
  {
    src: '/fotos-estancia/entrada.jpeg',
    alt: 'Entrada da Estância 3 Amores com a placa de boas-vindas',
  },
  {
    src: '/fotos-estancia/equipe.jpeg',
    alt: 'Equipe da Estância 3 Amores reunida na área de cultivo',
  },
  {
    src: 'public/fotos-estancia/horta.jpeg',
    alt: 'Canteiros de alface na estufa da Estância 3 Amores',
  },
  {
    src: '/fotos-estancia/plantacao.jpeg',
    alt: 'Plantação de abacaxis e bananeiras da Estância 3 Amores',
  },
]

// Exibe as fotos da Estância na página Sobre.
function Gallery() {
  return (
    <section className="gallery">
      <h2 className="gallery-title">Fotos</h2>

      <div className="gallery-grid">
        {fotos.map((foto) => (
          <img
            key={foto.src}
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