// Exibe a tabela e os totais recebidos da página que gera o relatório.

function RelatorioResultado({
  titulo,
  resultados,
  colunas,
  chaveRegistro,
  onRetornar,
  totais = [],
}) {
  const dataGeracao = new Intl.DateTimeFormat(
    'pt-BR',
    {
      dateStyle: 'short',
      timeStyle: 'short',
    }
  ).format(new Date())

  // Abre a impressão do navegador, que também permite salvar em PDF.
  function handleImprimir() {
    window.print()
  }

  return (
    <section className="relatorio-resultado">
      <div className="relatorio-impressao">
        <header className="relatorio-impressao__cabecalho">
          <h1>{titulo}</h1>

          <p>
            Gerado em: {dataGeracao}
          </p>
        </header>

        <div className="relatorio-tabela-container">
          <table className="relatorio-tabela">
            <thead>
              <tr>
                {colunas.map((coluna) => (
                  <th key={coluna.chave}>
                    {coluna.titulo}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {resultados.map((registro) => (
                <tr
                  key={
                    typeof chaveRegistro === 'function'
                      ? chaveRegistro(registro)
                      : registro[chaveRegistro]
                  }
                >
                  {colunas.map((coluna) => (
                    <td key={coluna.chave}>
                      {coluna.render
                        ? coluna.render(registro)
                        : registro[coluna.chave]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="relatorio-totais">
          <h2>Resumo do relatório</h2>

          <div className="relatorio-totais__item">
            <span>Registros apresentados</span>
            <strong>{resultados.length}</strong>
          </div>

          {totais.map((total) => (
            <div
              key={total.chave}
              className="relatorio-totais__item"
            >
              <span>{total.rotulo}</span>
              <strong>{total.valor}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="relatorio-acoes">
        <button
          type="button"
          className="relatorio-retornar"
          onClick={onRetornar}
        >
          Retornar
        </button>

        <button
          type="button"
          className="relatorio-imprimir"
          onClick={handleImprimir}
        >
          Imprimir
        </button>
      </div>
    </section>
  )
}

export default RelatorioResultado
