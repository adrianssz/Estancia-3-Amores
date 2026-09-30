import AuthProvider from './contexts/AuthProvider'
import ClientesProvider from './contexts/ClientesProvider'
import EntregasProvider from './contexts/EntregasProvider'
import PedidosProvider from './contexts/PedidosProvider'
import PlantiosProvider from './contexts/PlantiosProvider'
import ProdutosProvider from './contexts/ProdutosProvider'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <AuthProvider>
      <PlantiosProvider>
        <ClientesProvider>
          <ProdutosProvider>
            <PedidosProvider>
              <EntregasProvider>
                <AppRoutes />
              </EntregasProvider>
            </PedidosProvider>
          </ProdutosProvider>
        </ClientesProvider>
      </PlantiosProvider>
    </AuthProvider>
  )
}

export default App