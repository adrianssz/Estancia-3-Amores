// Define as unidades disponíveis no cadastro e na edição dos produtos.
export const UNIDADES_PRODUTO = [
  { valor: 'UN', rotulo: 'Unidade (UN)' },
  { valor: 'KG', rotulo: 'Quilograma (KG)' },
  { valor: 'G', rotulo: 'Grama (G)' },
  { valor: 'MÇ', rotulo: 'Maço (MÇ)' },
  { valor: 'SC', rotulo: 'Sacola (SC)' },
]

// Confere se a unidade está entre as opções permitidas.
export function unidadeProdutoValida(unidade) {
  return UNIDADES_PRODUTO.some(
    (opcao) => opcao.valor === unidade
  )
}

// Busca o nome da unidade; se não encontrar, mantém o valor recebido.
export function obterRotuloUnidadeProduto(unidade) {
  const opcao = UNIDADES_PRODUTO.find(
    (item) => item.valor === unidade
  )

  return opcao?.rotulo ?? unidade
}
