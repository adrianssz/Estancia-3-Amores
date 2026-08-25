import { PlantiosProvider } from './contexts/PlantiosContext'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <PlantiosProvider>
      <AppRoutes />
    </PlantiosProvider>
  )
}

export default App