import Header from '../components/Header'
import BottomMenu from '../components/BottomMenu'
import Gallery from '../components/Gallery'
import VisitMap from '../components/VisitMap'



// Apresenta a Estância, a galeria e o acesso à localização.
function Sobre() {


  return (

    <>

      <Header />


      <main className="sobre-page">


        <img className="sobre-logo" src="/logo-estancia.png" alt="Logo da Estância Três Amores" />


        <span className="section-eyebrow sobre-eyebrow">Conheça nossa história</span>
        <h1>Estância <em>3 Amores</em></h1>


        <p className="subtitulo">

          Produtor e venda de alimentos frescos

        </p>



        <section>

          <h2>
            Quem somos?
          </h2>


          <p>

            Somos uma estância dedicada à produção
            e venda de alimentos frescos, oferecendo
            qualidade e produtos naturais para nossos clientes.

          </p>


        </section>



        <Gallery />



        <section className="visita">

          <h2>
            Faça-nos uma visita
          </h2>

        </section>



        <VisitMap />


      </main>



      <BottomMenu />


    </>

  )

}


export default Sobre
