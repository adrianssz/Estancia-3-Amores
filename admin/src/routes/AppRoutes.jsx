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

import Clientes from '../pages/Clientes'
import AdicionarCliente from '../pages/AdicionarCliente'
import EditarCliente from '../pages/EditarCliente'
import ExcluirCliente from '../pages/ExcluirCliente'

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

          <Route
            path="/clientes"
            element={<Clientes />}
          />

          <Route
            path="/clientes/adicionar"
            element={<AdicionarCliente />}
          />

          <Route
            path="/clientes/:codigo/editar"
            element={<EditarCliente />}
          />

          <Route
            path="/clientes/:codigo/excluir"
            element={<ExcluirCliente />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes