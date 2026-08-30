import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import ProtectedRoute from '../components/ProtectedRoute'
import AdminLayout from '../layouts/AdminLayout'

import Login from '../pages/Login'
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

import Relatorios from '../pages/Relatorios'
import RelatorioPlantios from '../pages/RelatorioPlantios'
import RelatorioPedidos from '../pages/RelatorioPedidos'
import RelatorioClientes from '../pages/RelatorioClientes'
import RelatorioEntregas from '../pages/RelatorioEntregas'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route element={<ProtectedRoute />}>
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

            <Route
              path="/relatorios"
              element={<Relatorios />}
            />

            <Route
              path="/relatorios/plantios"
              element={<RelatorioPlantios />}
            />

            <Route
              path="/relatorios/pedidos"
              element={<RelatorioPedidos />}
            />

            <Route
              path="/relatorios/clientes"
              element={<RelatorioClientes />}
            />

            <Route
              path="/relatorios/entregas"
              element={<RelatorioEntregas />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes