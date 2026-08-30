import ClientesProvider from './contexts/ClientesProvider'
import EntregasProvider from './contexts/EntregasProvider'
import PedidosProvider from './contexts/PedidosProvider'
import PlantiosProvider from './contexts/PlantiosProvider'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <PlantiosProvider>
      <ClientesProvider>
        <PedidosProvider>
          <EntregasProvider>
            <AppRoutes />
          </EntregasProvider>
        </PedidosProvider>
      </ClientesProvider>
    </PlantiosProvider>
  )
}

export default App