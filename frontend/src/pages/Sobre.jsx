import Header from '../components/Header'
import BottomMenu from '../components/BottomMenu'
import Gallery from '../components/Gallery'
import VisitMap from '../components/VisitMap'

import '../styles/Sobre.css'


function Sobre() {


  return (

    <>

      <Header />


      <main className="sobre-page">


        <div className="sobre-logo">

          LOGO

        </div>


        <h1>
          Estância 3 Amores
        </h1>


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