import { Link } from 'react-router-dom'

import { usePlantios } from '../contexts/PlantiosContext'


function IconeEditar() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M4 16.5V20h3.5L18.3 9.2l-3.5-3.5L4 16.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="m13.8 6.7 3.5 3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}


function IconeExcluir() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M4 7h16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M9 7V4h6v3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M7 7l1 13h8l1-13"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M10 11v5M14 11v5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}


// Exibe os plantios e o gráfico de distribuição por tipo.
function Plantios() {
  const { plantios } = usePlantios()

  // Conta os registros para calcular a distribuição dos plantios.
  const totalPlantios = plantios.length

  const totalFrutas = plantios.filter(
    (plantio) =>
      plantio.tipo.toLowerCase() === 'fruta'
  ).length

  const totalLegumes = plantios.filter(
    (plantio) =>
      plantio.tipo.toLowerCase() === 'legume'
  ).length

  const totalHortalicas = plantios.filter(
    (plantio) =>
      plantio.tipo.toLowerCase() === 'hortaliça'
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

  // Monta as fatias do gráfico e usa fundo neutro quando não há plantios.
  const graficoBackground =
    totalPlantios > 0
      ? `conic-gradient(
          #5dd62c 0% ${limiteFrutas}%,
          #337418 ${limiteFrutas}% ${limiteLegumes}%,
          #a8e782 ${limiteLegumes}% 100%
        )`
      : '#eeeeee'


  return (
    <section className="plantios-page">

      <h1 className="plantios-page__title">
        Plantios
      </h1>


      <div className="plantios-grafico">

        <h2>
          Plantios por Tipo
        </h2>


        <div className="plantios-grafico__conteudo">

          <div
            className="plantios-grafico__pizza"
            style={{
              background: graficoBackground,
            }}
            aria-label="Gráfico de distribuição dos plantios por tipo"
            role="img"
          >
            <span className="plantios-grafico__centro" aria-hidden="true">
              <strong>{totalPlantios}</strong>
              <small>plantios</small>
            </span>
          </div>


          <div className="plantios-grafico__legenda">

            <div>
              <span
                className="legenda-cor legenda-frutas"
              />

              <span>
                Frutas ({totalFrutas})
              </span>
            </div>


            <div>
              <span
                className="legenda-cor legenda-legumes"
              />

              <span>
                Legumes ({totalLegumes})
              </span>
            </div>


            <div>
              <span
                className="legenda-cor legenda-hortalicas"
              />

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


      <div className="plantios-tabela-wrapper">

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

                <td
                  className="plantios-tabela__nome"
                  data-label="Plantio"
                >
                  {plantio.nome}
                </td>

                <td data-label="Tipo de Planta">
                  {plantio.tipo}
                </td>

                <td data-label="Área">
                  {plantio.area} m
                </td>

                <td data-label="Quantidade">
                  {plantio.quantidade}
                </td>

                <td
                  className="plantios-tabela__acoes"
                  data-label="Ações"
                >

                  <div className="plantios-tabela__acoes-conteudo">

                    <Link
                      to={`/plantios/${plantio.id}/editar`}
                      className="plantios-acao plantios-acao--editar"
                      aria-label={`Editar plantio ${plantio.nome}`}
                      title="Editar"
                    >
                      <IconeEditar />
                    </Link>


                    <Link
                      to={`/plantios/${plantio.id}/excluir`}
                      className="plantios-acao plantios-acao--excluir"
                      aria-label={`Excluir plantio ${plantio.nome}`}
                      title="Excluir"
                    >
                      <IconeExcluir />
                    </Link>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </section>
  )
}


export default Plantios
