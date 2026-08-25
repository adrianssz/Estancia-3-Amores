import { Link } from 'react-router-dom'

import { usePlantios } from '../contexts/PlantiosContext'
import '../styles/Plantios.css'

function Plantios() {
  const { plantios } = usePlantios()

  const totalPlantios = plantios.length

  const totalFrutas = plantios.filter(
    (plantio) => plantio.tipo.toLowerCase() === 'fruta'
  ).length

  const totalLegumes = plantios.filter(
    (plantio) => plantio.tipo.toLowerCase() === 'legume'
  ).length

  const totalHortalicas = plantios.filter(
    (plantio) => plantio.tipo.toLowerCase() === 'hortaliça'
  ).length

  const percentualFrutas =
    totalPlantios > 0
      ? (totalFrutas / totalPlantios) * 100
      : 0

  const percentualLegumes =
    totalPlantios > 0
      ? (totalLegumes / totalPlantios) * 100
      : 0

  const limiteFrutas = percentualFrutas

  const limiteLegumes =
    percentualFrutas + percentualLegumes

  const graficoBackground =
    totalPlantios > 0
      ? `conic-gradient(
          #ffffff 0% ${limiteFrutas}%,
          #d8d8d8 ${limiteFrutas}% ${limiteLegumes}%,
          #bcbcbc ${limiteLegumes}% 100%
        )`
      : '#eeeeee'

  return (
    <section className="plantios-page">
      <h1 className="plantios-page__title">
        Plantios
      </h1>

      <div className="plantios-grafico">
        <h2>Plantios por Tipo</h2>

        <div className="plantios-grafico__conteudo">
          <div
            className="plantios-grafico__pizza"
            style={{
              background: graficoBackground,
            }}
          ></div>

          <div className="plantios-grafico__legenda">
            <div>
              <span className="legenda-cor legenda-frutas"></span>

              <span>
                Frutas ({totalFrutas})
              </span>
            </div>

            <div>
              <span className="legenda-cor legenda-legumes"></span>

              <span>
                Legumes ({totalLegumes})
              </span>
            </div>

            <div>
              <span className="legenda-cor legenda-hortalicas"></span>

              <span>
                Hortaliças ({totalHortalicas})
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="plantios-acoes">
        <Link
          to="/plantios/adicionar"
          className="plantios-adicionar"
        >
          + Adicionar Plantios
        </Link>
      </div>

      <table className="plantios-tabela">
        <thead>
          <tr>
            <th>Plantio</th>
            <th>Tipo de Planta</th>
            <th>Área</th>
            <th>Quantidade</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {plantios.map((plantio) => (
            <tr key={plantio.id}>
              <td>{plantio.nome}</td>
              <td>{plantio.tipo}</td>
              <td>{plantio.area} m</td>
              <td>{plantio.quantidade}</td>

              <td>
                <Link
                  to={`/plantios/${plantio.id}/editar`}
                >
                  Editar
                </Link>

                {' | '}

                <Link
                  to={`/plantios/${plantio.id}/excluir`}
                >
                  Excluir
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

export default Plantios