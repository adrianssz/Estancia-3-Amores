import ClientesProvider from './contexts/ClientesProvider'
import PlantiosProvider from './contexts/PlantiosProvider'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <PlantiosProvider>
      <ClientesProvider>
        <AppRoutes />
      </ClientesProvider>
    </PlantiosProvider>
  )
}

export default App