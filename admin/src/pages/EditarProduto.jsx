import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { useProdutos } from '../contexts/ProdutosContext'
import '../styles/EditarProduto.css'

function FormularioEditarProduto({
  produto,
  editarProduto,
}) {
  const [nome, setNome] = useState(produto.nome)
  const [unidade, setUnidade] = useState(produto.unidade)
  const [preco, setPreco] = useState(produto.preco)
  const [categoria, setCategoria] = useState(produto.categoria)
  const [status, setStatus] = useState(produto.status)
  const [estoque, setEstoque] = useState(produto.estoque)
  const [imagem, setImagem] = useState(produto.imagem)

  const [editadoComSucesso, setEditadoComSucesso] =
    useState(false)

  const [salvando, setSalvando] = useState(false)
  const [erroEdicao, setErroEdicao] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()

    const precoNumerico = Number(preco)
    const estoqueNumerico = Number(estoque)

    if (
      precoNumerico < 0 ||
      estoqueNumerico < 0 ||
      !Number.isInteger(estoqueNumerico)
    ) {
      return
    }

    setSalvando(true)
    setErroEdicao('')

    try {
      await editarProduto(
        produto.id,
        {
          nome: nome.trim(),
          unidade: unidade.trim(),
          preco: precoNumerico,
          categoria,
          status,
          estoque: estoqueNumerico,
          imagem: imagem.trim(),
        }
      )

      setEditadoComSucesso(true)
    } catch (error) {
      console.error(
        'Erro ao editar produto:',
        error
      )

      setErroEdicao(
        'Erro ao salvar as alterações. Tente novamente.'
      )
    } finally {
      setSalvando(false)
    }
  }

  function handleEditarNovamente() {
    setErroEdicao('')
    setEditadoComSucesso(false)
  }

  return (
    <section className="editar-produto-page">
      <h1 className="editar-produto-page__title">
        Editar Produto
      </h1>

      <form
        className="editar-produto-form"
        onSubmit={handleSubmit}
      >
        <div className="editar-produto-form__grupo">
          <label htmlFor="nome">
            Nome
          </label>

          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(event) =>
              setNome(event.target.value)
            }
            disabled={editadoComSucesso || salvando}
            required
          />
        </div>

        <div className="editar-produto-form__grupo">
          <label htmlFor="unidade">
            Unidade
          </label>

          <input
            id="unidade"
            type="text"
            value={unidade}
            onChange={(event) =>
              setUnidade(event.target.value)
            }
            placeholder="Ex.: Unidade, 1 KG, 500 g"
            disabled={editadoComSucesso || salvando}
            required
          />
        </div>

        <div className="editar-produto-form__grupo">
          <label htmlFor="preco">
            Preço
          </label>

          <input
            id="preco"
            type="number"
            min="0"
            step="0.01"
            value={preco}
            onChange={(event) =>
              setPreco(event.target.value)
            }
            disabled={editadoComSucesso || salvando}
            required
          />
        </div>

        <div className="editar-produto-form__grupo">
          <label htmlFor="categoria">
            Categoria
          </label>

          <select
            id="categoria"
            value={categoria}
            onChange={(event) =>
              setCategoria(event.target.value)
            }
            disabled={editadoComSucesso || salvando}
            required
          >
            <option value="Legumes">
              Legumes
            </option>

            <option value="Verduras">
              Verduras
            </option>

            <option value="Frutas">
              Frutas
            </option>

            <option value="Grãos">
              Grãos
            </option>
          </select>
        </div>

        <div className="editar-produto-form__grupo">
          <label htmlFor="status">
            Status
          </label>

          <select
            id="status"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
            disabled={editadoComSucesso || salvando}
            required
          >
            <option value="pronta-entrega">
              Pronta Entrega
            </option>

            <option value="em-crescimento">
              Em Crescimento
            </option>
          </select>
        </div>

        <div className="editar-produto-form__grupo">
          <label htmlFor="estoque">
            Estoque
          </label>

          <input
            id="estoque"
            type="number"
            min="0"
            step="1"
            value={estoque}
            onChange={(event) =>
              setEstoque(event.target.value)
            }
            disabled={editadoComSucesso || salvando}
            required
          />
        </div>

        <div className="editar-produto-form__grupo">
          <label htmlFor="imagem">
            Imagem
          </label>

          <input
            id="imagem"
            type="text"
            value={imagem}
            onChange={(event) =>
              setImagem(event.target.value)
            }
            disabled={editadoComSucesso || salvando}
            required
          />
        </div>

        {erroEdicao && (
          <div
            className="editar-produto-alert"
            role="alert"
          >
            {erroEdicao}
          </div>
        )}

        {editadoComSucesso && (
          <div
            className="editar-produto-alert"
            role="alert"
          >
            Produto editado! Clique em
            {' '}
            &apos;Retornar a Produtos&apos;
            {' '}
            para retornar, ou
            {' '}
            &apos;+ Editar Produto&apos;
            {' '}
            para editar novamente.
          </div>
        )}

        <div className="editar-produto-form__acoes">
          {!editadoComSucesso && (
            <button
              type="submit"
              className="editar-produto-form__salvar"
              disabled={salvando}
            >
              {salvando
                ? 'Salvando...'
                : 'Salvar alterações'}
            </button>
          )}

          {editadoComSucesso && (
            <button
              type="button"
              className="editar-produto-form__salvar"
              onClick={handleEditarNovamente}
            >
              + Editar Produto
            </button>
          )}

          <Link
            to="/produtos"
            className="editar-produto-form__retornar"
          >
            Retornar a Produtos
          </Link>
        </div>
      </form>
    </section>
  )
}

function EditarProduto() {
  const { id } = useParams()

  const {
    produtos,
    carregandoProdutos,
    erroProdutos,
    editarProduto,
  } = useProdutos()

  if (carregandoProdutos) {
    return (
      <section className="editar-produto-page">
        <h1 className="editar-produto-page__title">
          Carregando produto...
        </h1>
      </section>
    )
  }

  if (erroProdutos) {
    return (
      <section className="editar-produto-page">
        <h1 className="editar-produto-page__title">
          Não foi possível carregar o produto
        </h1>

        <div className="editar-produto-form__acoes">
          <Link
            to="/produtos"
            className="editar-produto-form__retornar"
          >
            Retornar a Produtos
          </Link>
        </div>
      </section>
    )
  }

  const produtoSelecionado = produtos.find(
    (produto) => produto.id === Number(id)
  )

  if (!produtoSelecionado) {
    return (
      <section className="editar-produto-page">
        <h1 className="editar-produto-page__title">
          Produto não encontrado
        </h1>

        <div className="editar-produto-form__acoes">
          <Link
            to="/produtos"
            className="editar-produto-form__retornar"
          >
            Retornar a Produtos
          </Link>
        </div>
      </section>
    )
  }

  return (
    <FormularioEditarProduto
      produto={produtoSelecionado}
      editarProduto={editarProduto}
    />
  )
}

export default EditarProduto