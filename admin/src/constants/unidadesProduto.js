
export const UNIDADES_PRODUTO = [
  { valor: 'UN', rotulo: 'Unidade (UN)' },
  { valor: 'KG', rotulo: 'Quilograma (KG)' },
  { valor: 'G', rotulo: 'Grama (G)' },
  { valor: 'MÇ', rotulo: 'Maço (MÇ)' },
  { valor: 'SC', rotulo: 'Sacola (SC)' },
]

export function unidadeProdutoValida(unidade) {
  return UNIDADES_PRODUTO.some(
    (opcao) => opcao.valor === unidade
  )
}

export function obterRotuloUnidadeProduto(unidade) {
  const opcao = UNIDADES_PRODUTO.find(
    (item) => item.valor === unidade
  )

  return opcao?.rotulo ?? unidade
}
