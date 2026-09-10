import { useState } from 'react'
import { Link } from 'react-router-dom'

import { useClientes } from '../contexts/ClientesContext'
import { useEntregas } from '../contexts/EntregasContext'
import '../styles/AdicionarEntrega.css'


function AdicionarEntrega() {
  const {
    clientes,
    carregandoClientes,
    erroClientes,
  } = useClientes()

  const {
    adicionarEntrega,
  } = useEntregas()

  const [clienteId, setClienteId] = useState('')
  const [data, setData] = useState('')
  const [status, setStatus] = useState('Pendente')
  const [endereco, setEndereco] = useState('')

  const [erroData, setErroData] = useState(false)
  const [erro, setErro] = useState('')
  const [adicionando, setAdicionando] = useState(false)

  const [
    adicionadaComSucesso,
    setAdicionadaComSucesso,
  ] = useState(false)


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

    return (
      dataInformada.getFullYear() === ano &&
      dataInformada.getMonth() === mes - 1 &&
      dataInformada.getDate() === dia
    )
  }


  function handleClienteChange(event) {
    const novoClienteId = event.target.value

    setClienteId(novoClienteId)
    setErro('')

    const clienteSelecionado = clientes.find(
      (cliente) =>
        cliente.id === Number(novoClienteId)
    )

    setEndereco(
      clienteSelecionado?.endereco ?? ''
    )
  }


  function handleDataChange(event) {
    setData(
      formatarData(event.target.value)
    )

    setErroData(false)
    setErro('')
  }


  async function handleSubmit(event) {
    event.preventDefault()

    setErro('')

    if (!clienteId) {
      setErro(
        'Selecione um cliente para a entrega.'
      )
      return
    }

    if (!dataValida(data)) {
      setErroData(true)
      return
    }

    const clienteSelecionado = clientes.find(
      (cliente) =>
        cliente.id === Number(clienteId)
    )

    if (!clienteSelecionado) {
      setErro(
        'O cliente selecionado não foi encontrado.'
      )
      return
    }

    setAdicionando(true)

    const resultado = await adicionarEntrega({
      clienteId: clienteSelecionado.id,
      cliente: clienteSelecionado.nome,
      endereco,
      data,
      status,
    })

    setAdicionando(false)

    if (!resultado.sucesso) {
      setErro(resultado.mensagem)
      return
    }

    setErroData(false)
    setAdicionadaComSucesso(true)
  }


  function handleNovaEntrega() {
    setClienteId('')
    setData('')
    setStatus('Pendente')
    setEndereco('')
    setErroData(false)
    setErro('')
    setAdicionadaComSucesso(false)
  }


  return (
    <section className="adicionar-entrega-page">

      <h1 className="adicionar-entrega-page__title">
        Adicionar
      </h1>


      <form
        className="adicionar-entrega-form"
        onSubmit={handleSubmit}
      >

        <div className="adicionar-entrega-form__grupo">

          <label htmlFor="cliente">
            Cliente
          </label>

          <select
            id="cliente"
            value={clienteId}
            onChange={handleClienteChange}
            disabled={
              adicionadaComSucesso ||
              adicionando ||
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


        <div className="adicionar-entrega-form__grupo">

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
              adicionadaComSucesso ||
              adicionando
            }
            required
          />

          {erroData && (
            <p className="adicionar-entrega-form__erro">
              Data Inválida
            </p>
          )}

        </div>


        <div className="adicionar-entrega-form__grupo">

          <label htmlFor="endereco">
            Endereço
          </label>

          <input
            id="endereco"
            type="text"
            value={endereco}
            onChange={(event) => {
              setEndereco(event.target.value)
              setErro('')
            }}
            disabled={
              adicionadaComSucesso ||
              adicionando
            }
            required
          />

        </div>


        <div className="adicionar-entrega-form__grupo">

          <label htmlFor="status">
            Status
          </label>

          <select
            id="status"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
            disabled={
              adicionadaComSucesso ||
              adicionando
            }
            required
          >
            <option value="Pendente">
              Pendente
            </option>

            <option value="Em Rota">
              Em Rota
            </option>

            <option value="Cancelado">
              Cancelado
            </option>

            <option value="Entregue">
              Entregue
            </option>
          </select>

        </div>


        {erroClientes && (
          <div
            className="adicionar-entrega-alert"
            role="alert"
          >
            {erroClientes}
          </div>
        )}


        {erro && (
          <div
            className="adicionar-entrega-alert"
            role="alert"
          >
            {erro}
          </div>
        )}


        {adicionadaComSucesso && (
          <div
            className="adicionar-entrega-alert"
            role="alert"
          >
            Entrega adicionada! Clique em
            {' '}
            &apos;Retornar a Entregas&apos;
            {' '}
            para retornar, ou
            {' '}
            &apos;+ Adicionar Entrega&apos;
            {' '}
            para cadastrar uma nova entrega.
          </div>
        )}


        <div className="adicionar-entrega-form__acoes">

          {!adicionadaComSucesso && (
            <button
              type="submit"
              className="adicionar-entrega-form__adicionar"
              disabled={
                adicionando ||
                carregandoClientes
              }
            >
              {adicionando
                ? 'Adicionando...'
                : '+ Adicionar Entrega'}
            </button>
          )}


          {adicionadaComSucesso && (
            <button
              type="button"
              className="adicionar-entrega-form__adicionar"
              onClick={handleNovaEntrega}
            >
              + Adicionar Entrega
            </button>
          )}


          <Link
            to="/entregas"
            className="adicionar-entrega-form__retornar"
          >
            Retornar a Entregas
          </Link>

        </div>

      </form>

    </section>
  )
}


export default AdicionarEntrega