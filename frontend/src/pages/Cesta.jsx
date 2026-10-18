import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import Header from '../components/Header'
import BottomMenu from '../components/BottomMenu'
import CartItem from '../components/CartItem'

import { supabase } from '../services/supabase'

import '../styles/Cesta.css'


// Recupera a cesta persistida no navegador e descarta conteúdo inválido.
function lerCestaSalva() {
  try {
    const cestaSalva =
      JSON.parse(
        localStorage.getItem('cesta')
      ) || []

    return Array.isArray(cestaSalva)
      ? cestaSalva
      : []
  } catch {
    localStorage.removeItem('cesta')
    return []
  }
}


// Salva a cesta e avisa os componentes que acompanham sua quantidade.
function salvarCesta(cesta) {
  localStorage.setItem(
    'cesta',
    JSON.stringify(cesta)
  )

  window.dispatchEvent(
    new Event('cestaAtualizada')
  )
}


// Mantém as quantidades da cesta como números inteiros positivos.
function normalizarQuantidade(quantidade) {
  const valor = Number(quantidade)

  if (
    !Number.isFinite(valor) ||
    valor < 1
  ) {
    return 1
  }

  return Math.floor(valor)
}


// Compara os dados persistidos com a versão atual do produto.
function produtoFoiAtualizado(
  produtoSalvo,
  produtoAtual
) {
  return (
    produtoSalvo.nome !== produtoAtual.nome ||
    produtoSalvo.unidade !== produtoAtual.unidade ||
    Number(produtoSalvo.preco) !==
      Number(produtoAtual.preco) ||
    Number(produtoSalvo.estoque) !==
      Number(produtoAtual.estoque) ||
    produtoSalvo.status !== produtoAtual.status ||
    (produtoSalvo.imagem || '') !==
      (produtoAtual.imagem || '')
  )
}


// Controla os itens da cesta e a preparação da mensagem para o WhatsApp.
function Cesta() {
  const [cesta, setCesta] = useState([])
  const [avisoCesta, setAvisoCesta] = useState('')
  const [sincronizando, setSincronizando] =
    useState(false)

  const telefoneWhatsApp = '5544998125510'


  // Consulta os produtos atuais e reconcilia preço, unidade, estoque e disponibilidade.
  const sincronizarCesta = useCallback(async () => {
    const cestaSalva = lerCestaSalva()

    if (cestaSalva.length === 0) {
      setCesta([])
      setAvisoCesta('')

      return {
        sucesso: true,
        cestaAtualizada: [],
        houveAjustes: false,
      }
    }

    setSincronizando(true)

    try {
      const idsProdutos = [
        ...new Set(
          cestaSalva
            .map((produto) =>
              Number(produto.id)
            )
            .filter((id) =>
              Number.isSafeInteger(id)
            )
        ),
      ]

      if (idsProdutos.length === 0) {
        setCesta([])
        salvarCesta([])

        const mensagem =
          'Os itens inválidos foram removidos da cesta.'

        setAvisoCesta(mensagem)

        return {
          sucesso: true,
          cestaAtualizada: [],
          houveAjustes: true,
        }
      }

      const {
        data,
        error,
      } = await supabase
        .from('vw_produtos_mais_vendidos')
        .select(`
          id,
          nome,
          unidade,
          preco,
          categoria,
          status,
          estoque,
          imagem
        `)
        .in('id', idsProdutos)

      if (error) {
        throw error
      }

      const produtosAtuais = new Map(
        (data ?? []).map((produto) => [
          String(produto.id),
          {
            ...produto,
            preco: Number(produto.preco),
            estoque: Number(produto.estoque),
            imagem: produto.imagem || '',
          },
        ])
      )

      const removidos = []
      const indisponiveis = []
      const quantidadesAjustadas = []
      const dadosAtualizados = []

      const cestaAtualizada = []

      cestaSalva.forEach((produtoSalvo) => {
        const produtoAtual =
          produtosAtuais.get(
            String(produtoSalvo.id)
          )

        if (!produtoAtual) {
          removidos.push(
            produtoSalvo.nome ||
            `Produto ${produtoSalvo.id}`
          )
          return
        }

        if (
          produtoAtual.status !==
            'pronta-entrega' ||
          !Number.isFinite(
            produtoAtual.estoque
          ) ||
          produtoAtual.estoque <= 0
        ) {
          indisponiveis.push(
            produtoAtual.nome
          )
          return
        }

        let quantidade =
          normalizarQuantidade(
            produtoSalvo.quantidadeCesta
          )

        if (
          quantidade >
          produtoAtual.estoque
        ) {
          quantidade =
            produtoAtual.estoque

          quantidadesAjustadas.push(
            produtoAtual.nome
          )
        }

        if (
          produtoFoiAtualizado(
            produtoSalvo,
            produtoAtual
          )
        ) {
          dadosAtualizados.push(
            produtoAtual.nome
          )
        }

        cestaAtualizada.push({
          id: produtoAtual.id,
          nome: produtoAtual.nome,
          unidade: produtoAtual.unidade,
          preco: produtoAtual.preco,
          categoria: produtoAtual.categoria,
          status: produtoAtual.status,
          estoque: produtoAtual.estoque,
          imagem: produtoAtual.imagem,
          quantidadeCesta: quantidade,
        })
      })

      const mensagens = []

      if (removidos.length > 0) {
        mensagens.push(
          `Removido(s) porque não existem mais: ${removidos.join(', ')}.`
        )
      }

      if (indisponiveis.length > 0) {
        mensagens.push(
          `Removido(s) porque não estão disponíveis: ${indisponiveis.join(', ')}.`
        )
      }

      if (quantidadesAjustadas.length > 0) {
        mensagens.push(
          `Quantidade ajustada ao estoque atual: ${quantidadesAjustadas.join(', ')}.`
        )
      }

      if (dadosAtualizados.length > 0) {
        mensagens.push(
          `Dados atualizados conforme preço, unidade e estoque atuais: ${[
            ...new Set(dadosAtualizados),
          ].join(', ')}.`
        )
      }

      const houveAjustes =
        mensagens.length > 0

      setCesta(cestaAtualizada)
      salvarCesta(cestaAtualizada)

      setAvisoCesta(
        mensagens.join(' ')
      )

      return {
        sucesso: true,
        cestaAtualizada,
        houveAjustes,
      }
    } catch (error) {
      console.error(
        'Erro ao atualizar os dados da cesta:',
        error
      )

      setCesta(cestaSalva)

      setAvisoCesta(
        'Não foi possível conferir os dados atuais da cesta. Tente novamente antes de realizar o pedido.'
      )

      return {
        sucesso: false,
        cestaAtualizada: cestaSalva,
        houveAjustes: false,
      }
    } finally {
      setSincronizando(false)
    }
  }, [])


  // Atualiza ao abrir a cesta e sempre que a aba volta a ficar disponível ao usuário.
  useEffect(() => {
    sincronizarCesta()

    function handleFocus() {
      sincronizarCesta()
    }

    function handleVisibilityChange() {
      if (
        document.visibilityState ===
        'visible'
      ) {
        sincronizarCesta()
      }
    }

    window.addEventListener(
      'focus',
      handleFocus
    )

    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange
    )

    return () => {
      window.removeEventListener(
        'focus',
        handleFocus
      )

      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange
      )
    }
  }, [sincronizarCesta])


  // Atualiza a tela e persiste as alterações feitas pelo cliente.
  function atualizarCesta(novaCesta) {
    setCesta(novaCesta)
    setAvisoCesta('')
    salvarCesta(novaCesta)
  }


  // Remove o produto selecionado da cesta.
  function removerProduto(id) {
    const novaCesta =
      cesta.filter(
        (produto) =>
          produto.id !== id
      )

    atualizarCesta(novaCesta)
  }


  // Aumenta a quantidade respeitando o estoque conferido no Supabase.
  function aumentarQuantidade(id) {
    const novaCesta =
      cesta.map((produto) => {
        if (produto.id !== id) {
          return produto
        }

        const estoque =
          Number(produto.estoque)

        const quantidadeAtual =
          normalizarQuantidade(
            produto.quantidadeCesta
          )

        if (
          Number.isFinite(estoque) &&
          quantidadeAtual >= estoque
        ) {
          alert(
            'Quantidade máxima disponível em estoque atingida.'
          )

          return produto
        }

        return {
          ...produto,
          quantidadeCesta:
            quantidadeAtual + 1,
        }
      })

    atualizarCesta(novaCesta)
  }


  // Diminui a quantidade mantendo o mínimo de uma unidade inteira.
  function diminuirQuantidade(id) {
    const novaCesta =
      cesta.map((produto) => {
        if (produto.id !== id) {
          return produto
        }

        const quantidadeAtual =
          normalizarQuantidade(
            produto.quantidadeCesta
          )

        if (quantidadeAtual <= 1) {
          return produto
        }

        return {
          ...produto,
          quantidadeCesta:
            quantidadeAtual - 1,
        }
      })

    atualizarCesta(novaCesta)
  }


  // Soma os subtotais usando os dados já reconciliados da cesta.
  const total =
    cesta.reduce(
      (soma, produto) => {
        const preco =
          Number(produto.preco) || 0

        const quantidade =
          Number(
            produto.quantidadeCesta
          ) || 0

        return (
          soma +
          preco * quantidade
        )
      },
      0
    )


  // Confere novamente a cesta antes de preparar a mensagem do WhatsApp.
  async function realizarPedido() {
    if (
      cesta.length === 0 ||
      sincronizando
    ) {
      return
    }

    const janelaWhatsApp =
      window.open('', '_blank')

    if (!janelaWhatsApp) {
      alert(
        'Não foi possível abrir o WhatsApp. Verifique se o navegador está bloqueando novas abas.'
      )
      return
    }

    janelaWhatsApp.opener = null

    const resultado =
      await sincronizarCesta()

    if (!resultado.sucesso) {
      janelaWhatsApp.close()

      alert(
        'Não foi possível conferir os dados atuais dos produtos. O pedido não foi preparado.'
      )
      return
    }

    if (
      resultado.cestaAtualizada.length === 0
    ) {
      janelaWhatsApp.close()

      alert(
        'Não há produtos disponíveis na cesta para realizar o pedido.'
      )
      return
    }

    if (resultado.houveAjustes) {
      janelaWhatsApp.close()

      alert(
        'A cesta foi atualizada com os dados atuais dos produtos. Revise os itens e clique novamente em Realizar Pedido.'
      )
      return
    }

    const itensPedido =
      resultado.cestaAtualizada.map(
        (produto) => {
          const preco =
            Number(produto.preco) || 0

          const quantidade =
            Number(
              produto.quantidadeCesta
            ) || 0

          const subtotal =
            preco * quantidade

          const subtotalFormatado =
            subtotal
              .toFixed(2)
              .replace('.', ',')

          return (
            `• ${quantidade}x ${produto.nome}` +
            ` (${produto.unidade})` +
            ` - R$ ${subtotalFormatado}`
          )
        }
      )

    const totalAtualizado =
      resultado.cestaAtualizada.reduce(
        (soma, produto) =>
          soma +
          Number(produto.preco) *
            Number(
              produto.quantidadeCesta
            ),
        0
      )

    const totalFormatado =
      totalAtualizado
        .toFixed(2)
        .replace('.', ',')

    const mensagem = [
      'Olá! Gostaria de realizar um pedido na Estância 3 Amores.',
      '',
      'Itens do pedido:',
      ...itensPedido,
      '',
      `Total: R$ ${totalFormatado}`,
    ].join('\n')

    const whatsappUrl =
      `https://wa.me/${telefoneWhatsApp}?text=${encodeURIComponent(mensagem)}`

    janelaWhatsApp.location.href =
      whatsappUrl
  }


  return (
    <>
      <Header />

      <main className="cesta-page">
        <h1 className="cesta-title">
          Cesta
        </h1>

        <section className="cesta-container">
          {sincronizando && (
            <p role="status">
              Atualizando dados da cesta...
            </p>
          )}

          {avisoCesta && (
            <p
              role="alert"
              aria-live="polite"
            >
              {avisoCesta}
            </p>
          )}

          {cesta.length > 0 ? (
            cesta.map((produto) => (
              <CartItem
                key={produto.id}
                produto={produto}
                removerProduto={
                  removerProduto
                }
                aumentarQuantidade={
                  aumentarQuantidade
                }
                diminuirQuantidade={
                  diminuirQuantidade
                }
              />
            ))
          ) : (
            <div className="cesta-vazia">
              <p>
                Sua cesta está vazia.
              </p>
            </div>
          )}

          <div className="cesta-total-area">
            <span>
              Total
            </span>

            <strong>
              R$ {total
                .toFixed(2)
                .replace('.', ',')}
            </strong>
          </div>

          <button
            type="button"
            className="realizar-pedido-button"
            onClick={realizarPedido}
            disabled={
              cesta.length === 0 ||
              sincronizando
            }
          >
            {sincronizando
              ? 'ATUALIZANDO...'
              : 'REALIZAR PEDIDO'}
          </button>
        </section>
      </main>

      <BottomMenu />
    </>
  )
}


export default Cesta