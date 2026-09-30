import {
  Route,
  Routes,
} from 'react-router-dom'

import Home from '../pages/Home'
import Feira from '../pages/Feira'
import Sobre from '../pages/Sobre'
import Contato from '../pages/Contato'
import Cesta from '../pages/Cesta'
import NotFound from '../pages/NotFound'

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/feira"
        element={<Feira />}
      />

      <Route
        path="/sobre"
        element={<Sobre />}
      />

      <Route
        path="/contato"
        element={<Contato />}
      />

      <Route
        path="/cesta"
        element={<Cesta />}
      />

      <Route
        path="*"
        element={<NotFound />}
      />
    </Routes>
  )
}

export default AppRoutes