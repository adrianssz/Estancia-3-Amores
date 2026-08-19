import Header from '../components/Header'
import Banner from '../components/Banner'
import ProductCard from '../components/ProductCard'
import Map from '../components/Map'
import BottomMenu from '../components/BottomMenu'


function Home() {

  const produtos = [
  {
    nome: "Produto Natural 1",
    preco: "25,00",
    imagem: "https://images.unsplash.com/photo-1542838132-92c53300491e"
  },

  {
    nome: "Produto Natural 2",
    preco: "18,00",
    imagem: "https://images.unsplash.com/photo-1488459716781-31db52582fe9"
  },

  {
    nome: "Produto Natural 3",
    preco: "32,00",
    imagem: "https://images.unsplash.com/photo-1466637574441-749b8f19452f"
  },

  {
    nome: "Produto Natural 4",
    preco: "15,00",
    imagem: "https://images.unsplash.com/photo-1498837167922-ddd27525d352"
  }
]


  return (
    <>

      <Header />

      <Banner />


      <h2>
        Destaques
      </h2>


      <section className="products-grid">

        {
          produtos.map((produto, index) => (
            <ProductCard
              key={index}
              {...produto}
            />
          ))
        }

      </section>


      <Map />

      <BottomMenu />


    </>
  )
}


export default Home