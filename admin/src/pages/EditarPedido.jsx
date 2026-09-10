import { useState } from 'react'

import {
  Link,
  useParams,
} from 'react-router-dom'

import { useClientes } from '../contexts/ClientesContext'
import { usePedidos } from '../contexts/PedidosContext'
import { useProdutos } from '../contexts/ProdutosContext'

import '../styles/EditarPedido.css'


function criarItemVazio() {
  return {
    produtoId: '',
    quantidade: '1',
  }
}


function FormularioEditarPedido({
  pedidoSelecionado,
  clientes,
  produtos,
  carregandoClientes,
  carregandoProdutos,
  erroClientes,
  erroProdutos,
  editarPedido,
}) {
  const [clienteId, setClienteId] = useState(
    String(pedidoSelecionado.clienteId ?? '')
  )

  const [status, setStatus] = useState(
    pedidoSelecionado.status ?? 'Pendente'
  )

  const [data, setData] = useState(
    pedidoSelecionado.data ?? ''
  )

  const [itens, setItens] = useState(() => {
    if (
      Array.isArray(pedidoSelecionado.itens) &&
      pedidoSelecionado.itens.length > 0
    ) {
      return pedidoSelecionado.itens.map(
        (item) => ({
          produtoId: String(item.produtoId),
          quantidade: String(item.quantidade),
        })
      )
    }

    return [
      criarItemVazio(),
    ]
  })

  const [
    editadoComSucesso,
    setEditadoComSucesso,
  ] = useState(false)

  const [erroData, setErroData] = useState(false)
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)


  const clienteSelecionado = clientes.find(
    (cliente) =>
      cliente.id === Number(clienteId)
  )

  const telefone =
    clienteSelecionado?.telefone ?? ''

  const produtosSelecionadosIds = new Set(
    itens
      .map((item) => Number(item.produtoId))
      .filter((id) => Number.isInteger(id) && id > 0)
  )

  const produtosDisponiveis = produtos.filter(
    (produto) =>
      (
        produto.status === 'pronta-entrega' &&
        Number(produto.estoque) > 0
      ) ||
      produtosSelecionadosIds.has(produto.id)
  )


  function formatarData(valor) {
    const numeros = valor
      .replace(/\D/g, '')
      .slice(0, 8)

    if (numeros.length <= 2) {
      return numeros
    }

    if (numeros.length <= 4) {
      return `${numeros.slice(0, 2)}/${numeros.slice(2)}`
    }

    return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4)}`
  }


  function dataValida(valor) {
    const formatoCorreto =
      /^\d{2}\/\d{2}\/\d{4}$/.test(valor)

    if (!formatoCorreto) {
      return false
    }

    const [dia, mes, ano] = valor
      .split('/')
      .map(Number)

    const dataInformada = new Date(
      ano,
      mes - 1,
      dia
    )

    const dataExiste =
      dataInformada.getFullYear() === ano &&
      dataInformada.getMonth() === mes - 1 &&
      dataInformada.getDate() === dia

    if (!dataExiste) {
      return false
    }

    const hoje = new Date()

    hoje.setHours(0, 0, 0, 0)
    dataInformada.setHours(0, 0, 0, 0)

    return dataInformada <= hoje
  }


  function handleClienteChange(event) {
    setClienteId(event.target.value)
    setErro('')
    setEditadoComSucesso(false)
  }


  function handleDataChange(event) {
    setData(
      formatarData(event.target.value)
    )

    setErroData(false)
    setErro('')
    setEditadoComSucesso(false)
  }


  function handleItemChange(
    indice,
    campo,
    valor
  ) {
    setItens((itensAtuais) =>
      itensAtuais.map(
        (item, indiceAtual) =>
          indiceAtual === indice
            ? {
                ...item,
                [campo]: valor,
              }
            : item
      )
    )

    setErro('')
    setEditadoComSucesso(false)
  }


  function handleAdicionarItem() {
    setItens((itensAtuais) => [
      ...itensAtuais,
      criarItemVazio(),
    ])

    setErro('')
    setEditadoComSucesso(false)
  }


  function handleRemoverItem(indice) {
    if (itens.length === 1) {
      return
    }

    setItens((itensAtuais) =>
      itensAtuais.filter(
        (_, indiceAtual) =>
          indiceAtual !== indice
      )
    )

    setErro('')
    setEditadoComSucesso(false)
  }


  async function handleSubmit(event) {
    event.preventDefault()

    setErro('')
    setErroData(false)
    setEditadoComSucesso(false)

    if (!clienteSelecionado) {
      setErro(
        'Selecione um cliente válido.'
      )
      return
    }

    if (!dataValida(data)) {
      setErroData(true)
      return
    }

    const itensNormalizados = itens.map(
      (item) => ({
        produtoId: Number(item.produtoId),
        quantidade: Number(item.quantidade),
      })
    )

    const possuiItemInvalido =
      itensNormalizados.some(
        (item) =>
          !Number.isInteger(item.produtoId) ||
          item.produtoId <= 0 ||
          !Number.isInteger(item.quantidade) ||
          item.quantidade <= 0
      )

    if (possuiItemInvalido) {
      setErro(
        'Selecione um produto e informe uma quantidade válida para cada item.'
      )
      return
    }

    const idsProdutos =
      itensNormalizados.map(
        (item) => item.produtoId
      )

    const possuiProdutoDuplicado =
      new Set(idsProdutos).size !==
      idsProdutos.length

    if (possuiProdutoDuplicado) {
      setErro(
        'O mesmo produto não pode ser adicionado mais de uma vez ao pedido.'
      )
      return
    }

    const quantidadeAcimaDoEstoque =
      itensNormalizados.some((item) => {
        const produto = produtos.find(
          (produtoAtual) =>
            produtoAtual.id === item.produtoId
        )

        if (!produto) {
          return true
        }

        return (
          item.quantidade >
          Number(produto.estoque)
        )
      })

    if (quantidadeAcimaDoEstoque) {
      setErro(
        'A quantidade informada não pode ser maior que o estoque disponível.'
      )
      return
    }

    setSalvando(true)

    const resultado = await editarPedido(
      pedidoSelecionado.id,
      {
        clienteId: clienteSelecionado.id,
        cliente: clienteSelecionado.nome,
        telefone: clienteSelecionado.telefone,
        status,
        data,
        itens: itensNormalizados,
      }
    )

    setSalvando(false)

    if (!resultado.sucesso) {
      setErro(resultado.mensagem)
      return
    }

    setEditadoComSucesso(true)
  }


  const carregandoOpcoes =
    carregandoClientes ||
    carregandoProdutos


  return (
    <section className="editar-pedido-page">

      <h1 className="editar-pedido-page__title">
        Editar
      </h1>


      <form
        className="editar-pedido-form"
        onSubmit={handleSubmit}
      >

        <div className="editar-pedido-form__grupo">

          <label htmlFor="cliente">
            Cliente
          </label>

          <select
            id="cliente"
            value={clienteId}
            onChange={handleClienteChange}
            disabled={
              salvando ||
              carregandoClientes
            }
            required
          >
            <option value="">
              {carregandoClientes
                ? 'Carregando clientes...'
                : 'Selecione um cliente'}
            </option>

            {clientes.map((cliente) => (
              <option
                key={cliente.id}
                value={cliente.id}
              >
                {cliente.nome}
              </option>
            ))}

          </select>

        </div>


        <div className="editar-pedido-form__grupo">

          <label htmlFor="telefone">
            Telefone
          </label>

          <input
            id="telefone"
            type="tel"
            value={telefone}
            readOnly
            disabled={salvando}
          />

        </div>


        <div className="editar-pedido-form__grupo">

          <label htmlFor="status">
            Status
          </label>

          <select
            id="status"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value)
              setErro('')
              setEditadoComSucesso(false)
            }}
            disabled={salvando}
            required
          >
            <option value="Pendente">
              Pendente
            </option>

            <option value="Em Rota">
              Em Rota
            </option>

            <option value="Entregue">
              Entregue
            </option>
          </select>

        </div>


        <div className="editar-pedido-form__grupo">

          <label htmlFor="data">
            Data
          </label>

          <input
            id="data"
            type="text"
            value={data}
            onChange={handleDataChange}
            placeholder="DD/MM/AAAA"
            maxLength="10"
            disabled={salvando}
            required
          />

          {erroData && (
            <p className="editar-pedido-form__erro">
              Data inválida! Por favor, corrija.
            </p>
          )}

        </div>


        {itens.map((item, indice) => {
          const produtoSelecionado =
            produtos.find(
              (produto) =>
                produto.id ===
                Number(item.produtoId)
            )

          return (
            <div key={indice}>

              <div className="editar-pedido-form__grupo">

                <label
                  htmlFor={`produto-${indice}`}
                >
                  Produto {indice + 1}
                </label>

                <select
                  id={`produto-${indice}`}
                  value={item.produtoId}
                  onChange={(event) =>
                    handleItemChange(
                      indice,
                      'produtoId',
                      event.target.value
                    )
                  }
                  disabled={
                    salvando ||
                    carregandoProdutos
                  }
                  required
                >
                  <option value="">
                    {carregandoProdutos
                      ? 'Carregando produtos...'
                      : 'Selecione um produto'}
                  </option>

                  {produtosDisponiveis.map(
                    (produto) => (
                      <option
                        key={produto.id}
                        value={produto.id}
                      >
                        {produto.nome}
                        {' - '}
                        Estoque: {produto.estoque}
                      </option>
                    )
                  )}

                </select>

              </div>


              <div className="editar-pedido-form__grupo">

                <label
                  htmlFor={`quantidade-${indice}`}
                >
                  Quantidade
                </label>

                <input
                  id={`quantidade-${indice}`}
                  type="number"
                  min="1"
                  step="1"
                  max={
                    produtoSelecionado
                      ? produtoSelecionado.estoque
                      : undefined
                  }
                  value={item.quantidade}
                  onChange={(event) =>
                    handleItemChange(
                      indice,
                      'quantidade',
                      event.target.value
                    )
                  }
                  disabled={salvando}
                  required
                />

              </div>


              {itens.length > 1 && (

                <div className="editar-pedido-form__acoes">

                  <button
                    type="button"
                    className="editar-pedido-form__retornar"
                    onClick={() =>
                      handleRemoverItem(indice)
                    }
                    disabled={salvando}
                  >
                    Remover produto
                  </button>

                </div>

              )}

            </div>
          )
        })}


        <div className="editar-pedido-form__acoes">

          <button
            type="button"
            className="editar-pedido-form__retornar"
            onClick={handleAdicionarItem}
            disabled={
              salvando ||
              carregandoOpcoes ||
              produtosDisponiveis.length === 0
            }
          >
            + Adicionar outro produto
          </button>

        </div>


        {(erroClientes || erroProdutos) && (

          <div
            className="editar-pedido-form__erro"
            role="alert"
          >
            {erroClientes || erroProdutos}
          </div>

        )}


        {erro && (

          <div
            className="editar-pedido-form__erro"
            role="alert"
          >
            {erro}
          </div>

        )}


        {editadoComSucesso && (

          <div
            className="editar-pedido-alert"
            role="alert"
          >
            Pedido editado! Clique em
            {' '}
            &apos;Retornar a Pedidos&apos;
            {' '}
            para retornar, ou altere os campos
            para editar novamente.
          </div>

        )}


        <div className="editar-pedido-form__acoes">

          <button
            type="submit"
            className="editar-pedido-form__salvar"
            disabled={
              salvando ||
              carregandoOpcoes
            }
          >
            {salvando
              ? 'Salvando...'
              : 'Salvar alterações'}
          </button>


          <Link
            to="/pedidos"
            className="editar-pedido-form__retornar"
          >
            Retornar a Pedidos
          </Link>

        </div>

      </form>

    </section>
  )
}


function EditarPedido() {
  const { id } = useParams()

  const {
    pedidos,
    carregando,
    erro: erroPedidos,
    editarPedido,
  } = usePedidos()

  const {
    clientes,
    carregandoClientes,
    erroClientes,
  } = useClientes()

  const {
    produtos,
    carregandoProdutos,
    erroProdutos,
  } = useProdutos()

  const pedidoSelecionado = pedidos.find(
    (pedido) =>
      pedido.id === Number(id)
  )


  if (
    carregando ||
    carregandoClientes ||
    carregandoProdutos
  ) {
    return (
      <section className="editar-pedido-page">

        <h1 className="editar-pedido-page__title">
          Carregando...
        </h1>

      </section>
    )
  }


  if (erroPedidos) {
    return (
      <section className="editar-pedido-page">

        <h1 className="editar-pedido-page__title">
          Erro ao carregar pedido
        </h1>

        <div
          className="editar-pedido-alert"
          role="alert"
        >
          {erroPedidos}
        </div>

        <div className="editar-pedido-form__acoes">

          <Link
            to="/pedidos"
            className="editar-pedido-form__retornar"
          >
            Retornar a Pedidos
          </Link>

        </div>

      </section>
    )
  }


  if (!pedidoSelecionado) {
    return (
      <section className="editar-pedido-page">

        <h1 className="editar-pedido-page__title">
          Pedido não encontrado
        </h1>

        <div className="editar-pedido-form__acoes">

          <Link
            to="/pedidos"
            className="editar-pedido-form__retornar"
          >
            Retornar a Pedidos
          </Link>

        </div>

      </section>
    )
  }


  return (
    <FormularioEditarPedido
      key={pedidoSelecionado.id}
      pedidoSelecionado={pedidoSelecionado}
      clientes={clientes}
      produtos={produtos}
      carregandoClientes={carregandoClientes}
      carregandoProdutos={carregandoProdutos}
      erroClientes={erroClientes}
      erroProdutos={erroProdutos}
      editarPedido={editarPedido}
    />
  )
}


export default EditarPedido