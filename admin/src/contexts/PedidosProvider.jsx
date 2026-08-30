import { useState } from 'react'

import pedidosIniciais from '../data/pedidos'
import PedidosContext from './PedidosContext'

function PedidosProvider({ children }) {
  const [pedidos, setPedidos] = useState(
    pedidosIniciais
  )

  function adicionarPedido(novoPedido) {
    setPedidos((pedidosAtuais) => [
      ...pedidosAtuais,
      novoPedido,
    ])
  }

  function editarPedido(id, dadosAtualizados) {
    setPedidos((pedidosAtuais) =>
      pedidosAtuais.map((pedido) =>
        pedido.id === id
          ? {
              ...pedido,
              ...dadosAtualizados,
            }
          : pedido
      )
    )
  }

  function excluirPedido(id) {
    setPedidos((pedidosAtuais) =>
      pedidosAtuais.filter(
        (pedido) => pedido.id !== id
      )
    )
  }

  return (
    <PedidosContext.Provider
      value={{
        pedidos,
        adicionarPedido,
        editarPedido,
        excluirPedido,
      }}
    >
      {children}
    </PedidosContext.Provider>
  )
}

export default PedidosProvider