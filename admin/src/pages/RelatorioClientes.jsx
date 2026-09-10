import {
  useEffect,
  useState,
} from 'react'
import { Link } from 'react-router-dom'

import RelatorioResultado from '../components/RelatorioResultado'
import { useClientes } from '../contexts/ClientesContext'
import { supabase } from '../services/supabase'

import '../styles/Relatorios.css'

function RelatorioClientes() {
  const {
    clientes,
    carregandoClientes,
    erroClientes,
  } = useClientes()

  const [pedidosPorCliente, setPedidosPorCliente] =
    useState({})

  const [carregandoPedidos, setCarregandoPedidos] =
    useState(true)

  const [erroPedidos, setErroPedidos] =
    useState('')

  const [clienteSelecionado, setClienteSelecionado] =
    useState('')

  const [resultados, setResultados] = useState([])
  const [mensagem, setMensagem] = useState('')

  const [relatorioGerado, setRelatorioGerado] =
    useState(false)

  useEffect(() => {
    let ativo = true

    async function carregarContagemPedidos() {
      const { data, error } = await supabase
        .from('pedidos')
        .select('cliente_id')

      if (!ativo) {
        return
      }

      if (error) {
        console.error(
          'Erro ao carregar pedidos para o relatório:',
          error
        )

        setPedidosPorCliente({})
        setErroPedidos(
          'Não foi possível carregar os pedidos.'
        )
        setCarregandoPedidos(false)
        return
      }

      const contagem = (data ?? []).reduce(
        (acumulador, pedido) => {
          const clienteId = pedido.cliente_id

          acumulador[clienteId] =
            (acumulador[clienteId] ?? 0) + 1

          return acumulador
        },
        {}
      )

      setPedidosPorCliente(contagem)
      setCarregandoPedidos(false)
    }

    carregarContagemPedidos()

    return () => {
      ativo = false
    }
  }, [])

  const nomesClientes = [
    ...new Set(
      clientes
        .map((cliente) => cliente.nome)
        .filter(Boolean)
    ),
  ].sort((clienteA, clienteB) =>
    clienteA.localeCompare(clienteB, 'pt-BR')
  )

  function contarPedidos(cliente) {
    return pedidosPorCliente[cliente.id] ?? 0
  }

  const colunas = [
    {
      chave: 'codigo',
      titulo: 'Código',
    },
    {
      chave: 'nome',
      titulo: 'Nome',
    },
    {
      chave: 'telefone',
      titulo: 'Telefone',
    },
    {
      chave: 'endereco',
      titulo: 'Endereço',
    },
    {
      chave: 'status',
      titulo: 'Status',
      render: () => 'Não definido',
    },
    {
      chave: 'pedidos',
      titulo: 'Pedidos',
      render: (cliente) =>
        contarPedidos(cliente),
    },
  ]

  function limparResultadoAnterior() {
    setResultados([])
    setMensagem('')
    setRelatorioGerado(false)
  }

  function handleClienteChange(event) {
    setClienteSelecionado(event.target.value)
    limparResultadoAnterior()
  }

  function handleSubmit(event) {
    event.preventDefault()

    const clientesFiltrados = clientes.filter(
      (cliente) =>
        !clienteSelecionado ||
        cliente.nome === clienteSelecionado
    )

    if (clientesFiltrados.length === 0) {
      setMensagem(
        'Nenhum cliente encontrado para os filtros selecionados.'
      )
      setResultados([])
      setRelatorioGerado(false)
      return
    }

    setResultados(clientesFiltrados)
    setMensagem('')
    setRelatorioGerado(true)
  }

  if (carregandoClientes || carregandoPedidos) {
    return (
      <main className="relatorio-page">
        <section className="relatorio-cabecalho">
          <h1>Relatório Clientes</h1>

          <p>
            Carregando dados dos clientes...
          </p>
        </section>
      </main>
    )
  }

  if (erroClientes || erroPedidos) {
    return (
      <main className="relatorio-page">
        <section className="relatorio-cabecalho">
          <h1>Relatório Clientes</h1>
        </section>

        <section className="relatorio-conteudo">
          <div
            className="relatorio-alerta"
            role="alert"
          >
            {erroClientes || erroPedidos}
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
          titulo="Relatório de Clientes"
          resultados={resultados}
          colunas={colunas}
          chaveRegistro="codigo"
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
        <h1>Relatório Clientes</h1>

        <p>
          Defina os parâmetros para gerar o relatório
          de clientes.
        </p>
      </section>

      <section className="relatorio-conteudo">
        <form
          className="relatorio-form"
          onSubmit={handleSubmit}
        >
          <div className="relatorio-campo">
            <label htmlFor="relatorio-cliente">
              Cliente
            </label>

            <select
              id="relatorio-cliente"
              value={clienteSelecionado}
              onChange={handleClienteChange}
              disabled={clientes.length === 0}
            >
              <option value="">
                Todos os clientes
              </option>

              {nomesClientes.map((cliente) => (
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
            <label htmlFor="relatorio-cliente-status">
              Status
            </label>

            <select
              id="relatorio-cliente-status"
              value=""
              disabled
            >
              <option value="">
                Status não disponível no modelo atual
              </option>
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
            disabled={clientes.length === 0}
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

export default RelatorioClientes