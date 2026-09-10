import { useState } from 'react'
import { Link } from 'react-router-dom'

import { useClientes } from '../contexts/ClientesContext'
import { usePedidos } from '../contexts/PedidosContext'
import { useProdutos } from '../contexts/ProdutosContext'

import '../styles/AdicionarPedido.css'


function criarItemVazio() {
  return {
    produtoId: '',
    quantidade: '1',
  }
}


function AdicionarPedido() {
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

  const {
    adicionarPedido,
  } = usePedidos()

  const [clienteId, setClienteId] = useState('')
  const [status, setStatus] = useState('Pendente')
  const [data, setData] = useState('')

  const [itens, setItens] = useState([
    criarItemVazio(),
  ])

  const [
    adicionadoComSucesso,
    setAdicionadoComSucesso,
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

  const produtosDisponiveis = produtos.filter(
    (produto) =>
      produto.status === 'pronta-entrega' &&
      Number(produto.estoque) > 0
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
    setAdicionadoComSucesso(false)
  }


  function handleDataChange(event) {
    setData(
      formatarData(event.target.value)
    )

    setErroData(false)
    setErro('')
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
  }


  function handleAdicionarItem() {
    setItens((itensAtuais) => [
      ...itensAtuais,
      criarItemVazio(),
    ])

    setErro('')
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
  }


  async function handleSubmit(event) {
    event.preventDefault()

    setErro('')
    setErroData(false)

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

    const produtosSelecionados =
      itensNormalizados.map(
        (item) => item.produtoId
      )

    const possuiProdutoDuplicado =
      new Set(produtosSelecionados).size !==
      produtosSelecionados.length

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

    const resultado = await adicionarPedido({
      clienteId: clienteSelecionado.id,
      cliente: clienteSelecionado.nome,
      telefone: clienteSelecionado.telefone,
      status,
      data,
      itens: itensNormalizados,
    })

    setSalvando(false)

    if (!resultado.sucesso) {
      setErro(resultado.mensagem)
      return
    }

    setAdicionadoComSucesso(true)
  }


  function handleNovoPedido() {
    setClienteId('')
    setStatus('Pendente')
    setData('')
    setItens([
      criarItemVazio(),
    ])
    setErroData(false)
    setErro('')
    setAdicionadoComSucesso(false)
  }


  const carregandoOpcoes =
    carregandoClientes ||
    carregandoProdutos


  return (
    <section className="adicionar-pedido-page">

      <h1 className="adicionar-pedido-page__title">
        Adicionar
      </h1>


      <form
        className="adicionar-pedido-form"
        onSubmit={handleSubmit}
      >

        <div className="adicionar-pedido-form__grupo">

          <label htmlFor="cliente">
            Cliente
          </label>

          <select
            id="cliente"
            value={clienteId}
            onChange={handleClienteChange}
            disabled={
              adicionadoComSucesso ||
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


        <div className="adicionar-pedido-form__grupo">

          <label htmlFor="telefone">
            Telefone
          </label>

          <input
            id="telefone"
            type="tel"
            value={telefone}
            placeholder="Selecione o cliente"
            readOnly
            disabled={
              adicionadoComSucesso ||
              salvando
            }
          />

        </div>


        <div className="adicionar-pedido-form__grupo">

          <label htmlFor="status">
            Status
          </label>

          <select
            id="status"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value)
              setErro('')
            }}
            disabled={
              adicionadoComSucesso ||
              salvando
            }
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


        <div className="adicionar-pedido-form__grupo">

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
            disabled={
              adicionadoComSucesso ||
              salvando
            }
            required
          />

          {erroData && (
            <p className="adicionar-pedido-form__erro">
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

              <div className="adicionar-pedido-form__grupo">

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
                    adicionadoComSucesso ||
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


              <div className="adicionar-pedido-form__grupo">

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
                  disabled={
                    adicionadoComSucesso ||
                    salvando
                  }
                  required
                />

              </div>


              {itens.length > 1 &&
                !adicionadoComSucesso && (

                  <div className="adicionar-pedido-form__acoes">

                    <button
                      type="button"
                      className="adicionar-pedido-form__retornar"
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


        {!adicionadoComSucesso && (

          <div className="adicionar-pedido-form__acoes">

            <button
              type="button"
              className="adicionar-pedido-form__retornar"
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

        )}


        {(erroClientes || erroProdutos) && (

          <div
            className="adicionar-pedido-form__erro"
            role="alert"
          >
            {erroClientes || erroProdutos}
          </div>

        )}


        {erro && (

          <div
            className="adicionar-pedido-form__erro"
            role="alert"
          >
            {erro}
          </div>

        )}


        {adicionadoComSucesso && (

          <div
            className="adicionar-pedido-alert"
            role="alert"
          >
            Pedido adicionado! Clique em
            {' '}
            &apos;Retornar a Pedidos&apos;
            {' '}
            para retornar, ou
            {' '}
            &apos;+ Adicionar Pedido&apos;
            {' '}
            para cadastrar um novo pedido.
          </div>

        )}


        <div className="adicionar-pedido-form__acoes">

          {!adicionadoComSucesso && (

            <button
              type="submit"
              className="adicionar-pedido-form__adicionar"
              disabled={
                salvando ||
                carregandoOpcoes ||
                clientes.length === 0 ||
                produtosDisponiveis.length === 0
              }
            >
              {salvando
                ? 'Adicionando...'
                : '+ Adicionar Pedido'}
            </button>

          )}


          {adicionadoComSucesso && (

            <button
              type="button"
              className="adicionar-pedido-form__adicionar"
              onClick={handleNovoPedido}
            >
              + Adicionar Pedido
            </button>

          )}


          <Link
            to="/pedidos"
            className="adicionar-pedido-form__retornar"
          >
            Retornar a Pedidos
          </Link>

        </div>

      </form>

    </section>
  )
}


export default AdicionarPedido