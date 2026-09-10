import { useState } from 'react'

import {
  Link,
  useParams,
} from 'react-router-dom'

import { useClientes } from '../contexts/ClientesContext'
import { useEntregas } from '../contexts/EntregasContext'
import '../styles/EditarEntrega.css'


function FormularioEditarEntrega({
  entregaSelecionada,
  clientes,
  erroClientes,
  editarEntrega,
}) {
  const [clienteId, setClienteId] = useState(
    String(entregaSelecionada.clienteId)
  )

  const [endereco, setEndereco] = useState(
    entregaSelecionada.endereco
  )

  const [data, setData] = useState(
    entregaSelecionada.data
  )

  const [status, setStatus] = useState(
    entregaSelecionada.status
  )

  const [erroData, setErroData] = useState(false)
  const [erro, setErro] = useState('')
  const [editando, setEditando] = useState(false)

  const [
    editadaComSucesso,
    setEditadaComSucesso,
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

    if (clienteSelecionado) {
      setEndereco(
        clienteSelecionado.endereco ?? ''
      )
    }
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

    setEditando(true)

    const resultado = await editarEntrega(
      entregaSelecionada.codigo,
      {
        clienteId: clienteSelecionado.id,
        cliente: clienteSelecionado.nome,
        endereco,
        data,
        status,
      }
    )

    setEditando(false)

    if (!resultado.sucesso) {
      setErro(resultado.mensagem)
      return
    }

    setErroData(false)
    setEditadaComSucesso(true)
  }


  function handleEditarNovamente() {
    setErro('')
    setEditadaComSucesso(false)
  }


  return (
    <section className="editar-entrega-page">

      <h1 className="editar-entrega-page__title">
        Editar
      </h1>


      <h2 className="editar-entrega-page__subtitle">
        Entregas
      </h2>


      <form
        className="editar-entrega-form"
        onSubmit={handleSubmit}
      >

        <div className="editar-entrega-form__grupo">

          <label htmlFor="cliente">
            Cliente
          </label>

          <select
            id="cliente"
            value={clienteId}
            onChange={handleClienteChange}
            disabled={
              editadaComSucesso ||
              editando
            }
            required
          >
            <option value="">
              Selecione um cliente
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


        <div className="editar-entrega-form__grupo">

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
              editadaComSucesso ||
              editando
            }
            required
          />

        </div>


        <div className="editar-entrega-form__grupo">

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
              editadaComSucesso ||
              editando
            }
            required
          />

          {erroData && (
            <p className="editar-entrega-form__erro">
              Data Inválida
            </p>
          )}

        </div>


        <div className="editar-entrega-form__grupo">

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
              editadaComSucesso ||
              editando
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
            className="editar-entrega-alert"
            role="alert"
          >
            {erroClientes}
          </div>
        )}


        {erro && (
          <div
            className="editar-entrega-alert"
            role="alert"
          >
            {erro}
          </div>
        )}


        {editadaComSucesso && (
          <div
            className="editar-entrega-alert"
            role="alert"
          >
            Entrega editada! Clique em
            {' '}
            &apos;Retornar a Entregas&apos;
            {' '}
            para retornar, ou
            {' '}
            &apos;+ Editar Entrega&apos;
            {' '}
            para editar novamente.
          </div>
        )}


        <div className="editar-entrega-form__acoes">

          {!editadaComSucesso && (
            <button
              type="submit"
              className="editar-entrega-form__salvar"
              disabled={editando}
            >
              {editando
                ? 'Salvando...'
                : 'Salvar alterações'}
            </button>
          )}


          {editadaComSucesso && (
            <button
              type="button"
              className="editar-entrega-form__salvar"
              onClick={handleEditarNovamente}
            >
              + Editar Entrega
            </button>
          )}


          <Link
            to="/entregas"
            className="editar-entrega-form__retornar"
          >
            Retornar a Entregas
          </Link>

        </div>

      </form>

    </section>
  )
}


function EditarEntrega() {
  const { codigo } = useParams()

  const {
    clientes,
    carregandoClientes,
    erroClientes,
  } = useClientes()

  const {
    entregas,
    carregando,
    erro: erroEntregas,
    editarEntrega,
  } = useEntregas()


  const entregaSelecionada = entregas.find(
    (entrega) =>
      entrega.codigo === Number(codigo)
  )


  if (
    carregando ||
    carregandoClientes
  ) {
    return (
      <section className="editar-entrega-page">

        <h1 className="editar-entrega-page__title">
          Carregando...
        </h1>

      </section>
    )
  }


  if (erroEntregas) {
    return (
      <section className="editar-entrega-page">

        <h1 className="editar-entrega-page__title">
          Erro ao carregar entrega
        </h1>

        <div
          className="editar-entrega-alert"
          role="alert"
        >
          {erroEntregas}
        </div>

        <div className="editar-entrega-form__acoes">

          <Link
            to="/entregas"
            className="editar-entrega-form__retornar"
          >
            Retornar a Entregas
          </Link>

        </div>

      </section>
    )
  }


  if (!entregaSelecionada) {
    return (
      <section className="editar-entrega-page">

        <h1 className="editar-entrega-page__title">
          Entrega não encontrada
        </h1>

        <div className="editar-entrega-form__acoes">

          <Link
            to="/entregas"
            className="editar-entrega-form__retornar"
          >
            Retornar a Entregas
          </Link>

        </div>

      </section>
    )
  }


  return (
    <FormularioEditarEntrega
      key={entregaSelecionada.codigo}
      entregaSelecionada={entregaSelecionada}
      clientes={clientes}
      erroClientes={erroClientes}
      editarEntrega={editarEntrega}
    />
  )
}


export default EditarEntrega