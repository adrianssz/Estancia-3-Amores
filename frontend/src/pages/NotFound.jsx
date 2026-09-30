import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <main>
      <h1>Página não encontrada</h1>

      <p>
        O endereço acessado não existe.
      </p>

      <Link to="/">
        Voltar para a página inicial
      </Link>
    </main>
  )
}

export default NotFound