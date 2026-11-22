
import { useEffect, useState } from 'react'
import { FiCheck, FiX } from 'react-icons/fi'
import { createPortal } from 'react-dom'
import OrganicAction from './OrganicAction'


// Exibe o produto da Feira com disponibilidade e seleção de quantidade.
function ProductCardFeira({ produto }) {
  const [quantidade, setQuantidade] =
    useState(1)

  const [erroImagem, setErroImagem] =
    useState(false)

  const [avisoCesta, setAvisoCesta] = useState(null)

  // A confirmação visual desaparece sozinha e não interrompe a compra.
  useEffect(() => {
    if (!avisoCesta) return undefined
    const tempo = window.setTimeout(() => setAvisoCesta(null), 3500)
    return () => window.clearTimeout(tempo)
  }, [avisoCesta])

  const prontaEntrega =
    produto.status === 'pronta-entrega'

  const possuiEstoque =
    produto.estoque > 0

  const mostrarImagem =
    Boolean(produto.imagem) &&
    !erroImagem

  const unidade =
    produto.unidade || 'UN'

  // Aumenta a quantidade até o limite do estoque informado.
  function aumentarQuantidade() {
    if (quantidade >= produto.estoque) {
      alert(
        'Quantidade máxima disponível em estoque atingida.'
      )

      return
    }

    setQuantidade(
      quantidade + 1
    )
  }

  // Diminui a quantidade mantendo o mínimo de uma unidade.
  function diminuirQuantidade() {
    if (quantidade <= 1) {
      return
    }

    setQuantidade(
      quantidade - 1
    )
  }

  // Confere disponibilidade e estoque antes de incluir ou somar o produto na cesta.
  function adicionarNaCesta() {
    if (!prontaEntrega) {
      alert(
        'Este produto ainda está em crescimento.'
      )

      return
    }

    if (!possuiEstoque) {
      alert(
        'Produto esgotado.'
      )

      return
    }

    if (quantidade > produto.estoque) {
      alert(
        'Quantidade indisponível em estoque.'
      )

      return
    }

    const cestaAtual =
      JSON.parse(
        localStorage.getItem('cesta')
      ) || []

    const produtoExistente =
      cestaAtual.find(
        (item) =>
          item.id === produto.id
      )

    let novaCesta

    if (produtoExistente) {
      const novaQuantidade =
        produtoExistente.quantidadeCesta +
        quantidade

      if (
        novaQuantidade >
        produto.estoque
      ) {
        alert(
          'A quantidade solicitada ultrapassa o estoque disponível.'
        )

        return
      }

      novaCesta =
        cestaAtual.map((item) => {
          if (
            item.id === produto.id
          ) {
            return {
              ...item,
              quantidadeCesta:
                novaQuantidade,
            }
          }

          return item
        })
    } else {
      novaCesta = [
        ...cestaAtual,
        {
          ...produto,
          quantidadeCesta:
            quantidade,
        },
      ]
    }

    // Salva a cesta atualizada no navegador.
    localStorage.setItem(
      'cesta',
      JSON.stringify(novaCesta)
    )

    // Avisa os componentes que acompanham alterações na cesta.
    window.dispatchEvent(
      new Event('cestaAtualizada')
    )

    setAvisoCesta({
      texto: `${quantidade} ${unidade} adicionado(s) à cesta!`,
      id: Date.now(),
    })

    setQuantidade(1)
  }

  return (
    <>
    <article
      className={`feira-card ${
        !prontaEntrega
          ? 'produto-crescimento'
          : ''
      }`}
    >
      <div className="feira-card-image">
        {mostrarImagem ? (
          <img
            src={produto.imagem}
            alt={produto.nome}
            loading="lazy"
            onError={() =>
              setErroImagem(true)
            }
          />
        ) : (
          <span>
            Sem Foto
          </span>
        )}
      </div>

      <div className="feira-card-content">
        <h3>
          {produto.nome}
        </h3>

        <p>
          {unidade}
        </p>

        <strong>
          R$ {Number(produto.preco)
            .toFixed(2)
            .replace('.', ',')}
        </strong>
      </div>

      {prontaEntrega ? (
        <>
          <div className="quantidade-selector">
            <button
              type="button"
              onClick={diminuirQuantidade}
              disabled={
                quantidade === 1 ||
                !possuiEstoque
              }
              aria-label="Diminuir quantidade"
            >
              −
            </button>

            <span>
              {possuiEstoque
                ? quantidade
                : 0}
            </span>

            <button
              type="button"
              onClick={aumentarQuantidade}
              disabled={
                !possuiEstoque ||
                quantidade >=
                  produto.estoque
              }
              aria-label="Aumentar quantidade"
            >
              +
            </button>
          </div>

          <p className="estoque-info">
            {produto.estoque} {unidade} disponíveis
          </p>

          <OrganicAction
            type="button"
            className="adicionar-button"
            onClick={adicionarNaCesta}
            disabled={!possuiEstoque}
          >
            {possuiEstoque
              ? 'Adicionar'
              : 'Esgotado'}
          </OrganicAction>
        </>
      ) : (
        <div className="crescimento-info">
          Em crescimento
        </div>
      )}
    </article>
    {avisoCesta && createPortal(
      <div className="cart-toast" role="status" aria-live="polite">
        <span className="cart-toast-check"><FiCheck aria-hidden="true" /></span>
        <span>{avisoCesta.texto}</span>
        <button type="button" onClick={() => setAvisoCesta(null)} aria-label="Fechar aviso">
          <FiX aria-hidden="true" />
        </button>
      </div>,
      document.body
    )}
    </>
  )
}

export default ProductCardFeira
