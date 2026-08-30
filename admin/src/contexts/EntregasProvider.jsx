import { useState } from 'react'

import entregasIniciais from '../data/entregas'
import EntregasContext from './EntregasContext'

function EntregasProvider({ children }) {
  const [entregas, setEntregas] = useState(
    entregasIniciais
  )

  function adicionarEntrega(novaEntrega) {
    setEntregas((entregasAtuais) => [
      ...entregasAtuais,
      novaEntrega,
    ])
  }

  function editarEntrega(codigo, dadosAtualizados) {
    setEntregas((entregasAtuais) =>
      entregasAtuais.map((entrega) =>
        entrega.codigo === codigo
          ? {
              ...entrega,
              ...dadosAtualizados,
            }
          : entrega
      )
    )
  }

  function excluirEntrega(codigo) {
    setEntregas((entregasAtuais) =>
      entregasAtuais.filter(
        (entrega) => entrega.codigo !== codigo
      )
    )
  }

  return (
    <EntregasContext.Provider
      value={{
        entregas,
        adicionarEntrega,
        editarEntrega,
        excluirEntrega,
      }}
    >
      {children}
    </EntregasContext.Provider>
  )
}

export default EntregasProvider