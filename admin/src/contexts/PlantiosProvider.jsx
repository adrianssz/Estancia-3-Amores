import { useState } from 'react'

import plantiosIniciais from '../data/plantios'
import PlantiosContext from './PlantiosContext'

function PlantiosProvider({ children }) {
  const [plantios, setPlantios] = useState(
    plantiosIniciais
  )

  function adicionarPlantio(novoPlantio) {
    setPlantios((plantiosAtuais) => [
      ...plantiosAtuais,
      novoPlantio,
    ])
  }

  function editarPlantio(id, dadosAtualizados) {
    setPlantios((plantiosAtuais) =>
      plantiosAtuais.map((plantio) =>
        plantio.id === id
          ? {
              ...plantio,
              ...dadosAtualizados,
            }
          : plantio
      )
    )
  }

  function excluirPlantio(id) {
    setPlantios((plantiosAtuais) =>
      plantiosAtuais.filter(
        (plantio) => plantio.id !== id
      )
    )
  }

  return (
    <PlantiosContext.Provider
      value={{
        plantios,
        adicionarPlantio,
        editarPlantio,
        excluirPlantio,
      }}
    >
      {children}
    </PlantiosContext.Provider>
  )
}

export default PlantiosProvider