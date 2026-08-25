import { Outlet } from 'react-router-dom'
import Header from '../components/Header'

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