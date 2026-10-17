import { Link } from 'react-router-dom'

// Informa que o endereço não existe e oferece acesso ao Dashboard.
function NotFound() {
  return (
    <main>
      <h1>Página não encontrada</h1>

      <p>
        O endereço acessado não existe.
      </p>

      <Link to="/dashboard">
        Voltar para o Dashboard
      </Link>
    </main>
  )
}

export default NotFound