
import {
  useEffect,
  useState,
} from 'react'
import { Link } from 'react-router-dom'

import RelatorioResultado from '../components/RelatorioResultado'
import { supabase } from '../services/supabase'

import '../styles/Relatorios.css'

const formatadorMoeda = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const formatadorNumero = new Intl.NumberFormat('pt-BR')

const TAMANHO_PAGINA = 1000

// Valida o valor monetário e converte para centavos inteiros.
function converterCentavos(valor) {
  const numero = Number(valor)

  if (!Number.isFinite(numero)) {
    throw new Error('Valor monetário inválido no relatório.')
  }

  return Math.round(numero * 100)
}

// Consulta os registros em páginas ordenadas pelo ID até concluir a leitura.
async function consultarTodasPaginas(tabela, colunas) {
  const registros = []
  let inicio = 0
  let terminou = false

  while (!terminou) {
    const { data, error } = await supabase
      .from(tabela)
      .select(colunas)
      .order('id', { ascending: true })
      .range(inicio, inicio + TAMANHO_PAGINA - 1)

    if (error) {
      throw error
    }

    const pagina = data ?? []

    registros.push(...pagina)

    terminou = pagina.length < TAMANHO_PAGINA
    inicio += TAMANHO_PAGINA
  }

  return registros
}

// Converte a data do banco para dia/mês/ano.
function formatarData(data) {
  if (!data) {
    return ''
  }

  const partes = data.split('-')

  if (partes.length !== 3) {
    return data
  }

  return `${partes[2]}/${partes[1]}/${partes[0]}`
}

// Gera o relatório de pedidos com filtros e totais monetários.
function RelatorioPedidos() {
  const [pedidos, setPedidos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  const [clienteSelecionado, setClienteSelecionado] =
    useState('')

  const [statusSelecionado, setStatusSelecionado] =
    useState('')

  const [resultados, setResultados] = useState([])
  const [mensagem, setMensagem] = useState('')

  const [relatorioGerado, setRelatorioGerado] =
    useState(false)

  useEffect(() => {
    let ativo = true

    // Consulta pedidos e itens em paralelo para montar os valores de cada pedido.
    async function carregarPedidos() {
      try {
        const [pedidosBanco, itensBanco] = await Promise.all([
          consultarTodasPaginas(
            'pedidos',
            `
              id,
              cliente_id,
              telefone,
              status,
              data,
              clientes (
                nome
              )
            `
          ),
          consultarTodasPaginas(
            'pedido_itens',
            'id, pedido_id, quantidade, preco_unitario'
          ),
        ])

        if (!ativo) {
          return
        }

        // Acumula os totais em centavos usando os preços históricos dos itens.
        const totaisPorPedido = {}

        itensBanco.forEach((item) => {
          const quantidade = Number(item.quantidade)
          const precoCentavos = converterCentavos(
            item.preco_unitario
          )

          if (
            !Number.isInteger(quantidade) ||
            quantidade <= 0
          ) {
            throw new Error(
              'Quantidade inválida encontrada nos itens.'
            )
          }

          const subtotalCentavos =
            quantidade * precoCentavos

          if (!Number.isSafeInteger(subtotalCentavos)) {
            throw new Error(
              'Valor de pedido acima do limite permitido.'
            )
          }

          const totalAtual =
            totaisPorPedido[item.pedido_id] ?? 0

          const novoTotal =
            totalAtual + subtotalCentavos

          if (!Number.isSafeInteger(novoTotal)) {
            throw new Error(
              'Valor total acima do limite permitido.'
            )
          }

          totaisPorPedido[item.pedido_id] = novoTotal
        })

        const pedidosNormalizados = pedidosBanco.map(
          (pedido) => ({
            id: pedido.id,
            clienteId: pedido.cliente_id,
            cliente:
              pedido.clientes?.nome ??
              'Cliente não encontrado',
            telefone: pedido.telefone,
            status: pedido.status,
            data: pedido.data,
            totalCentavos:
              totaisPorPedido[pedido.id] ?? 0,
          })
        )

        setPedidos(pedidosNormalizados)
        setCarregando(false)
      } catch (error) {
        if (!ativo) {
          return
        }

        console.error(
          'Erro ao carregar pedidos para o relatório:',
          error
        )

        setPedidos([])
        setErro(
          'Não foi possível carregar os pedidos e seus valores.'
        )
        setCarregando(false)
      }
    }

    carregarPedidos()

    return () => {
      ativo = false
    }
  }, [])

  const clientes = [
    ...new Set(
      pedidos
        .map((pedido) => pedido.cliente)
        .filter(
          (cliente) =>
            cliente &&
            cliente !== 'Cliente não encontrado'
        )
    ),
  ].sort((clienteA, clienteB) =>
    clienteA.localeCompare(clienteB, 'pt-BR')
  )

  const statusPedidos = [
    ...new Set(
      pedidos
        .map((pedido) => pedido.status)
        .filter(Boolean)
    ),
  ].sort((statusA, statusB) =>
    statusA.localeCompare(statusB, 'pt-BR')
  )

  const colunas = [
    {
      chave: 'id',
      titulo: 'Pedido',
    },
    {
      chave: 'cliente',
      titulo: 'Cliente',
    },
    {
      chave: 'telefone',
      titulo: 'Telefone',
    },
    {
      chave: 'status',
      titulo: 'Status',
    },
    {
      chave: 'data',
      titulo: 'Data',
      render: (pedido) =>
        formatarData(pedido.data),
    },
    {
      chave: 'total',
      titulo: 'Valor total',
      render: (pedido) =>
        formatadorMoeda.format(
          pedido.totalCentavos / 100
        ),
    },
  ]

  const quantidadePedidos = resultados.length

  // Soma os valores dos pedidos incluídos no resultado filtrado.
  const totalGeralCentavos = resultados.reduce(
    (total, pedido) =>
      total + pedido.totalCentavos,
    0
  )

  // Limpa os resultados e as mensagens do relatório anterior.
  function limparResultadoAnterior() {
    setResultados([])
    setMensagem('')
    setRelatorioGerado(false)
  }

  // Atualiza o filtro de cliente e limpa o resultado anterior.
  function handleClienteChange(event) {
    setClienteSelecionado(event.target.value)
    limparResultadoAnterior()
  }

  // Atualiza o filtro de status e limpa o resultado anterior.
  function handleStatusChange(event) {
    setStatusSelecionado(event.target.value)
    limparResultadoAnterior()
  }

  // Combina os filtros de cliente e status para gerar o resultado.
  function handleSubmit(event) {
    event.preventDefault()

    const pedidosFiltrados = pedidos.filter(
      (pedido) => {
        const correspondeCliente =
          !clienteSelecionado ||
          pedido.cliente === clienteSelecionado

        const correspondeStatus =
          !statusSelecionado ||
          pedido.status === statusSelecionado

        return (
          correspondeCliente &&
          correspondeStatus
        )
      }
    )

    if (pedidosFiltrados.length === 0) {
      setMensagem(
        'Nenhum pedido encontrado para os filtros selecionados.'
      )
      setResultados([])
      setRelatorioGerado(false)
      return
    }

    setResultados(pedidosFiltrados)
    setMensagem('')
    setRelatorioGerado(true)
  }

  if (carregando) {
    return (
      <main className="relatorio-page">
        <section className="relatorio-cabecalho">
          <h1>Relatório Pedidos</h1>

          <p>Carregando pedidos...</p>
        </section>
      </main>
    )
  }

  if (erro) {
    return (
      <main className="relatorio-page">
        <section className="relatorio-cabecalho">
          <h1>Relatório Pedidos</h1>
        </section>

        <section className="relatorio-conteudo">
          <div
            className="relatorio-alerta"
            role="alert"
          >
            {erro}
          </div>

          <Link
            to="/relatorios"
            className="relatorio-retornar"
          >
            Retornar a Relatórios
          </Link>
        </section>
      </main>
    )
  }

  if (relatorioGerado) {
    return (
      <main className="relatorio-page">
        <RelatorioResultado
          titulo="Relatório de Pedidos"
          resultados={resultados}
          colunas={colunas}
          chaveRegistro="id"
          totais={[
            {
              chave: 'total-pedidos',
              rotulo: 'Quantidade de pedidos',
              valor: formatadorNumero.format(
                quantidadePedidos
              ),
            },
            {
              chave: 'valor-total',
              rotulo: 'Valor total dos pedidos',
              valor: formatadorMoeda.format(
                totalGeralCentavos / 100
              ),
            },
          ]}
          onRetornar={() =>
            setRelatorioGerado(false)
          }
        />
      </main>
    )
  }

  return (
    <main className="relatorio-page">
      <section className="relatorio-cabecalho">
        <h1>Relatório Pedidos</h1>

        <p>
          Defina os parâmetros para gerar o relatório
          de pedidos.
        </p>
      </section>

      <section className="relatorio-conteudo">
        <form
          className="relatorio-form"
          onSubmit={handleSubmit}
        >
          <div className="relatorio-campo">
            <label htmlFor="relatorio-pedido-cliente">
              Cliente
            </label>

            <select
              id="relatorio-pedido-cliente"
              value={clienteSelecionado}
              onChange={handleClienteChange}
            >
              <option value="">
                Todos os clientes
              </option>

              {clientes.map((cliente) => (
                <option
                  key={cliente}
                  value={cliente}
                >
                  {cliente}
                </option>
              ))}
            </select>
          </div>

          <div className="relatorio-campo">
            <label htmlFor="relatorio-pedido-status">
              Status
            </label>

            <select
              id="relatorio-pedido-status"
              value={statusSelecionado}
              onChange={handleStatusChange}
            >
              <option value="">
                Todos os status
              </option>

              {statusPedidos.map((status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>
              ))}
            </select>
          </div>

          {mensagem && (
            <div
              className="relatorio-alerta"
              role="alert"
              aria-live="polite"
            >
              {mensagem}
            </div>
          )}

          <button
            type="submit"
            className="relatorio-gerar"
          >
            Gerar Relatório
          </button>
        </form>

        <Link
          to="/relatorios"
          className="relatorio-retornar"
        >
          Retornar a Relatórios
        </Link>
      </section>
    </main>
  )
}

export default RelatorioPedidos
