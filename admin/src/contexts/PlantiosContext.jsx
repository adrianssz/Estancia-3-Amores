import {
  createContext,
  useContext,
  useState,
} from 'react'

import plantiosIniciais from '../data/plantios'

const PlantiosContext = createContext(null)

function PlantiosProvider({ children }) {
  const [plantios, setPlantios] = useState(plantiosIniciais)

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

function usePlantios() {
  const context = useContext(PlantiosContext)

  if (!context) {
    throw new Error(
      'usePlantios deve ser utilizado dentro de PlantiosProvider'
    )
  }

  return context
}

export {
  PlantiosProvider,
  usePlantios,
}