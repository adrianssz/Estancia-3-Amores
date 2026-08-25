import { useState } from 'react'

import clientesIniciais from '../data/clientes'
import ClientesContext from './ClientesContext'

function ClientesProvider({ children }) {
  const [clientes, setClientes] = useState(
    clientesIniciais
  )

  function adicionarCliente(novoCliente) {
    setClientes((clientesAtuais) => [
      ...clientesAtuais,
      novoCliente,
    ])
  }

  function editarCliente(codigo, dadosAtualizados) {
    setClientes((clientesAtuais) =>
      clientesAtuais.map((cliente) =>
        cliente.codigo === codigo
          ? {
              ...cliente,
              ...dadosAtualizados,
            }
          : cliente
      )
    )
  }

  function excluirCliente(codigo) {
    setClientes((clientesAtuais) =>
      clientesAtuais.filter(
        (cliente) => cliente.codigo !== codigo
      )
    )
  }

  return (
    <ClientesContext.Provider
      value={{
        clientes,
        adicionarCliente,
        editarCliente,
        excluirCliente,
      }}
    >
      {children}
    </ClientesContext.Provider>
  )
}

export default ClientesProvider