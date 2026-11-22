// Mantém a digitação parcial e acrescenta as barras conforme o usuário digita.
export function formatarData(valor) {
  const digitos = valor.replace(/\D/g, '').slice(0, 8)

  return [
    digitos.slice(0, 2),
    digitos.slice(2, 4),
    digitos.slice(4),
  ].filter(Boolean).join('/')
}

// Confere o calendário gregoriano sem deixar o JavaScript ajustar datas inválidas.
export function validarData(valor, { permitirFuturo = true, hoje = new Date() } = {}) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(valor)) {
    return 'Informe a data no formato DD/MM/AAAA.'
  }

  const [dia, mes, ano] = valor.split('/').map(Number)

  // Anos múltiplos de 100 só são bissextos quando também são múltiplos de 400.
  const bissexto = ano % 4 === 0 && (ano % 100 !== 0 || ano % 400 === 0)
  const diasNoMes = [31, bissexto ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

  if (ano === 0 || mes < 1 || mes > 12 || dia < 1 || dia > diasNoMes[mes - 1]) {
    return 'Data inválida. Informe um dia que exista no mês e ano indicados.'
  }

  // Compare apenas o dia do calendário local, sem converter a data digitada para UTC.
  const dataInformada = ano * 10000 + mes * 100 + dia
  const dataAtual = hoje.getFullYear() * 10000 + (hoje.getMonth() + 1) * 100 + hoje.getDate()

  if (!permitirFuturo && dataInformada > dataAtual) {
    return 'A data do pedido não pode ser posterior a hoje.'
  }

  return ''
}
