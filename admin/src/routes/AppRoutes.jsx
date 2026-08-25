import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import AdminLayout from '../layouts/AdminLayout'
import Dashboard from '../pages/Dashboard'
import Plantios from '../pages/Plantios'

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
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes