import ClientesProvider from './contexts/ClientesProvider'
import PedidosProvider from './contexts/PedidosProvider'
import PlantiosProvider from './contexts/PlantiosProvider'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <PlantiosProvider>
      <ClientesProvider>
        <PedidosProvider>
          <AppRoutes />
        </PedidosProvider>
      </ClientesProvider>
    </PlantiosProvider>
  )
}

export default App