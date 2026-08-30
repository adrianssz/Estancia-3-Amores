import { Link } from 'react-router-dom'

import '../styles/Relatorios.css'

const opcoesRelatorio = [
  {
    titulo: 'Relatório Plantios',
    descricao:
      'Visualizar informações consolidadas dos plantios cadastrados.',
    rota: '/relatorios/plantios',
  },
  {
    titulo: 'Relatório Pedidos',
    descricao:
      'Visualizar informações consolidadas dos pedidos realizados.',
    rota: '/relatorios/pedidos',
  },
  {
    titulo: 'Relatório Clientes',
    descricao:
      'Visualizar informações dos clientes cadastrados.',
    rota: '/relatorios/clientes',
  },
  {
    titulo: 'Relatório Entregas',
    descricao:
      'Visualizar informações consolidadas das entregas.',
    rota: '/relatorios/entregas',
  },
]

function Relatorios() {
  return (
    <main className="relatorios-page">
      <section className="relatorios-cabecalho">
        <h1>Relatórios</h1>

        <p>
          Selecione o tipo de relatório que deseja gerar.
        </p>
      </section>

      <section
        className="relatorios-opcoes"
        aria-label="Tipos de relatórios"
      >
        {opcoesRelatorio.map((opcao) => (
          <Link
            key={opcao.rota}
            to={opcao.rota}
            className="relatorios-opcao"
          >
            <strong>{opcao.titulo}</strong>

            <span>{opcao.descricao}</span>
          </Link>
        ))}
      </section>
    </main>
  )
}

export default Relatorios