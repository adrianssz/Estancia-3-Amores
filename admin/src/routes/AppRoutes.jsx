import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import AdminLayout from '../layouts/AdminLayout'
import Dashboard from '../pages/Dashboard'
import Plantios from '../pages/Plantios'
import AdicionarPlantio from '../pages/AdicionarPlantio'
import EditarPlantio from '../pages/EditarPlantio'
import ExcluirPlantio from '../pages/ExcluirPlantio'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />

        <Route element={<AdminLayout />}>
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/plantios"
            element={<Plantios />}
          />

          <Route
            path="/plantios/adicionar"
            element={<AdicionarPlantio />}
          />

          <Route
            path="/plantios/:id/editar"
            element={<EditarPlantio />}
          />

          <Route
            path="/plantios/:id/excluir"
            element={<ExcluirPlantio />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes