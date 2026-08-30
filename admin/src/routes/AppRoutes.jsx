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

import Pedidos from '../pages/Pedidos'
import AdicionarPedido from '../pages/AdicionarPedido'
import EditarPedido from '../pages/EditarPedido'
import ExcluirPedido from '../pages/ExcluirPedido'

import Entregas from '../pages/Entregas'
import AdicionarEntrega from '../pages/AdicionarEntrega'
import EditarEntrega from '../pages/EditarEntrega'
import ExcluirEntrega from '../pages/ExcluirEntrega'

import Produtos from '../pages/Produtos'
import AdicionarProduto from '../pages/AdicionarProduto'
import EditarProduto from '../pages/EditarProduto'
import ExcluirProduto from '../pages/ExcluirProduto'

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

          <Route
            path="/pedidos"
            element={<Pedidos />}
          />

          <Route
            path="/pedidos/adicionar"
            element={<AdicionarPedido />}
          />

          <Route
            path="/pedidos/:id/editar"
            element={<EditarPedido />}
          />

          <Route
            path="/pedidos/:id/excluir"
            element={<ExcluirPedido />}
          />

          <Route
            path="/entregas"
            element={<Entregas />}
          />

          <Route
            path="/entregas/adicionar"
            element={<AdicionarEntrega />}
          />

          <Route
            path="/entregas/:codigo/editar"
            element={<EditarEntrega />}
          />

          <Route
            path="/entregas/:codigo/excluir"
            element={<ExcluirEntrega />}
          />

          <Route
            path="/produtos"
            element={<Produtos />}
          />

          <Route
            path="/produtos/adicionar"
            element={<AdicionarProduto />}
          />

          <Route
            path="/produtos/:id/editar"
            element={<EditarProduto />}
          />

          <Route
            path="/produtos/:id/excluir"
            element={<ExcluirProduto />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes