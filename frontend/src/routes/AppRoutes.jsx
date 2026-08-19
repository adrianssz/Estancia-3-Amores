import { Routes, Route } from 'react-router-dom'

import Home from '../pages/Home'
import Feira from '../pages/Feira'
import Sobre from '../pages/Sobre'
import Contato from '../pages/Contato'
import Cesta from '../pages/Cesta'


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

    </Routes>

  )
}


export default AppRoutes