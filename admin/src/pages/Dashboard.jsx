import { Link } from 'react-router-dom'

import { useClientes } from '../contexts/ClientesContext'
import { useEntregas } from '../contexts/EntregasContext'
import { usePedidos } from '../contexts/PedidosContext'
import { usePlantios } from '../contexts/PlantiosContext'

import '../styles/Dashboard.css'

function converterDataParaNumero(data) {
  if (!data) {
    return 0
  }

  const partes = data.split('/')

  if (partes.length !== 3) {
    return 0
  }

  const [dia, mes, ano] = partes

  return new Date(
    Number(ano),
    Number(mes) - 1,
    Number(dia)
  ).getTime()
}

function Dashboard() {
  const { clientes } = useClientes()
  const { entregas } = useEntregas()
  const { pedidos } = usePedidos()
  const { plantios } = usePlantios()

  const clientesDisponiveis = Array.isArray(clientes)
  const entregasDisponiveis = Array.isArray(entregas)
  const pedidosDisponiveis = Array.isArray(pedidos)
  const plantiosDisponiveis = Array.isArray(plantios)

  const totalClientes = clientesDisponiveis
    ? clientes.length
    : 0

  const entregasRealizadas = entregasDisponiveis
    ? entregas.filter(
        (entrega) => entrega.status === 'Entregue'
      ).length
    : 0

  /*
   * Temporariamente, todos os registros de plantio
   * são considerados ativos.
   *
   * Na integração com o banco, esta regra será
   * substituída pelo status real do plantio.
   */
  const plantiosAtivos = plantiosDisponiveis
    ? plantios.length
    : 0

  const quantidadePedidosPorStatus = pedidosDisponiveis
    ? pedidos.reduce(
        (resultado, pedido) => {
          const status =
            pedido.status || 'Sem Status'

          resultado[status] =
            (resultado[status] || 0) + 1

          return resultado
        },
        {}
      )
    : {}

  const statusPedidos = Object.entries(
    quantidadePedidosPorStatus
  )

  const maiorQuantidadeStatus = Math.max(
    ...statusPedidos.map(
      ([, quantidade]) => quantidade
    ),
    1
  )

  const plantiosPorTipo = plantiosDisponiveis
    ? plantios.reduce(
        (resultado, plantio) => {
          const tipo =
            plantio.tipo || 'Não informado'

          resultado[tipo] =
            (resultado[tipo] || 0) + 1

          return resultado
        },
        {}
      )
    : {}

  const totalPlantios = Object.values(
    plantiosPorTipo
  ).reduce(
    (total, quantidade) =>
      total + quantidade,
    0
  )

  const tiposPlantio = Object.entries(
    plantiosPorTipo
  )

  let inicioGrafico = 0

  const partesGraficoPlantios =
    tiposPlantio.map(
      ([, quantidade], indice) => {
        const percentual =
          totalPlantios > 0
            ? (quantidade / totalPlantios) * 100
            : 0

        const fimGrafico =
          inicioGrafico + percentual

        const tons = [
          '#444444',
          '#777777',
          '#aaaaaa',
          '#cccccc',
        ]

        const parte = `${tons[indice % tons.length]} ${inicioGrafico}% ${fimGrafico}%`

        inicioGrafico = fimGrafico

        return parte
      }
    )

  const estiloGraficoPlantios =
    totalPlantios > 0
      ? {
          background: `conic-gradient(${partesGraficoPlantios.join(', ')})`,
        }
      : {}

  const ultimosPedidos = pedidosDisponiveis
    ? [...pedidos]
        .sort((pedidoA, pedidoB) => {
          const dataA =
            converterDataParaNumero(
              pedidoA.data
            )

          const dataB =
            converterDataParaNumero(
              pedidoB.data
            )

          if (dataA !== dataB) {
            return dataB - dataA
          }

          return (
            Number(pedidoB.id) -
            Number(pedidoA.id)
          )
        })
        .slice(0, 5)
    : []

  const dadosDisponiveis =
    clientesDisponiveis &&
    entregasDisponiveis &&
    pedidosDisponiveis &&
    plantiosDisponiveis

  return (
    <main className="dashboard-page">
      <section className="dashboard-cabecalho">
        <div>
          <h1>Dashboard</h1>

          <p>
            Visão geral da operação da
            Estância 3 Amores.
          </p>
        </div>
      </section>

      {!dadosDisponiveis && (
        <div
          className="dashboard-alerta"
          role="alert"
        >
          Dados indisponíveis
        </div>
      )}

      <section
        className="dashboard-indicadores"
        aria-label="Indicadores administrativos"
      >
        <article className="dashboard-card">
          <span className="dashboard-card__titulo">
            Clientes Totais
          </span>

          <strong className="dashboard-card__valor">
            {totalClientes}
          </strong>
        </article>

        <article className="dashboard-card">
          <span className="dashboard-card__titulo">
            Entregas Realizadas
          </span>

          <strong className="dashboard-card__valor">
            {entregasRealizadas}
          </strong>
        </article>

        <article className="dashboard-card">
          <span className="dashboard-card__titulo">
            Plantios Ativos
          </span>

          <strong className="dashboard-card__valor">
            {plantiosAtivos}
          </strong>
        </article>
      </section>

      <section className="dashboard-graficos">
        <article className="dashboard-painel">
          <h2>Status Pedido</h2>

          {statusPedidos.length === 0 ? (
            <div className="dashboard-vazio">
              Dados indisponíveis
            </div>
          ) : (
            <div className="dashboard-barras">
              {statusPedidos.map(
                ([status, quantidade]) => {
                  const altura =
                    (quantidade /
                      maiorQuantidadeStatus) *
                    100

                  return (
                    <div
                      className="dashboard-barra-item"
                      key={status}
                    >
                      <span className="dashboard-barra-valor">
                        {quantidade}
                      </span>

                      <div className="dashboard-barra-area">
                        <div
                          className="dashboard-barra"
                          style={{
                            height: `${altura}%`,
                          }}
                          title={`${status}: ${quantidade}`}
                        />
                      </div>

                      <span className="dashboard-barra-label">
                        {status}
                      </span>
                    </div>
                  )
                }
              )}
            </div>
          )}
        </article>

        <article className="dashboard-painel">
          <h2>Plantios por Tipo</h2>

          {totalPlantios === 0 ? (
            <div className="dashboard-vazio">
              Dados indisponíveis
            </div>
          ) : (
            <div className="dashboard-pizza-conteudo">
              <div
                className="dashboard-pizza"
                style={estiloGraficoPlantios}
                aria-label="Distribuição dos plantios por tipo"
              />

              <div className="dashboard-legenda">
                {tiposPlantio.map(
                  ([tipo, quantidade]) => {
                    const percentual =
                      (
                        (quantidade /
                          totalPlantios) *
                        100
                      ).toFixed(0)

                    return (
                      <div
                        className="dashboard-legenda-item"
                        key={tipo}
                      >
                        <span>
                          {tipo}
                        </span>

                        <strong>
                          {quantidade}
                          {' '}
                          ({percentual}%)
                        </strong>
                      </div>
                    )
                  }
                )}
              </div>
            </div>
          )}
        </article>
      </section>

      <section className="dashboard-painel dashboard-pedidos">
        <div className="dashboard-pedidos__cabecalho">
          <h2>Últimos Pedidos</h2>

          <Link
            to="/pedidos"
            className="dashboard-pedidos__link"
          >
            Ver todos os pedidos
          </Link>
        </div>

        {ultimosPedidos.length === 0 ? (
          <div className="dashboard-vazio">
            Nenhum pedido encontrado.
          </div>
        ) : (
          <div className="dashboard-tabela-container">
            <table className="dashboard-tabela">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Telefone</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {ultimosPedidos.map(
                  (pedido) => (
                    <tr key={pedido.id}>
                      <td>
                        {pedido.id}
                      </td>

                      <td>
                        {pedido.cliente}
                      </td>

                      <td>
                        {pedido.telefone}
                      </td>

                      <td>
                        {pedido.status}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}

export default Dashboard