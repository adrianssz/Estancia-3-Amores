import ClientesProvider from './contexts/ClientesProvider'
import EntregasProvider from './contexts/EntregasProvider'
import PedidosProvider from './contexts/PedidosProvider'
import PlantiosProvider from './contexts/PlantiosProvider'
import ProdutosProvider from './contexts/ProdutosProvider'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <PlantiosProvider>
      <ClientesProvider>
        <PedidosProvider>
          <EntregasProvider>
            <ProdutosProvider>
              <AppRoutes />
            </ProdutosProvider>
          </EntregasProvider>
        </PedidosProvider>
      </ClientesProvider>
    </PlantiosProvider>
  )
}

export default App