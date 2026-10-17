import { Outlet } from 'react-router-dom'
import Header from '../components/Header'

// Mantém o cabeçalho e exibe a tela correspondente à rota acessada.
function AdminLayout() {
  return (
    <>
      <Header />

      <main>
        <Outlet />
      </main>
    </>
  )
}

export default AdminLayout