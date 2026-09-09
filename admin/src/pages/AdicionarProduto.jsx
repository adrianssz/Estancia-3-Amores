import { useState } from 'react'
import { Link } from 'react-router-dom'

import { useProdutos } from '../contexts/ProdutosContext'
import '../styles/AdicionarProduto.css'

function AdicionarProduto() {
  const { adicionarProduto } = useProdutos()

  const [nome, setNome] = useState('')
  const [unidade, setUnidade] = useState('')
  const [preco, setPreco] = useState('')
  const [categoria, setCategoria] = useState('Legumes')
  const [status, setStatus] = useState('pronta-entrega')
  const [estoque, setEstoque] = useState('')
  const [imagem, setImagem] = useState('')

  const [adicionadoComSucesso, setAdicionadoComSucesso] =
    useState(false)

  const [salvando, setSalvando] = useState(false)
  const [erroCadastro, setErroCadastro] = useState('')

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

    const novoProduto = {
      nome: nome.trim(),
      unidade: unidade.trim(),
      preco: precoNumerico,
      categoria,
      status,
      estoque: estoqueNumerico,
      imagem: imagem.trim(),
    }

    setSalvando(true)
    setErroCadastro('')

    try {
      await adicionarProduto(novoProduto)

      setAdicionadoComSucesso(true)
    } catch (error) {
      console.error(
        'Erro ao adicionar produto:',
        error
      )

      setErroCadastro(
        'Erro ao salvar produto. Tente novamente.'
      )
    } finally {
      setSalvando(false)
    }
  }

  function handleNovoProduto() {
    setNome('')
    setUnidade('')
    setPreco('')
    setCategoria('Legumes')
    setStatus('pronta-entrega')
    setEstoque('')
    setImagem('')
    setErroCadastro('')
    setAdicionadoComSucesso(false)
  }

  return (
    <section className="adicionar-produto-page">
      <h1 className="adicionar-produto-page__title">
        Adicionar Produto
      </h1>

      <form
        className="adicionar-produto-form"
        onSubmit={handleSubmit}
      >
        <div className="adicionar-produto-form__grupo">
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
            disabled={adicionadoComSucesso || salvando}
            required
          />
        </div>

        <div className="adicionar-produto-form__grupo">
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
            disabled={adicionadoComSucesso || salvando}
            required
          />
        </div>

        <div className="adicionar-produto-form__grupo">
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
            placeholder="0,00"
            disabled={adicionadoComSucesso || salvando}
            required
          />
        </div>

        <div className="adicionar-produto-form__grupo">
          <label htmlFor="categoria">
            Categoria
          </label>

          <select
            id="categoria"
            value={categoria}
            onChange={(event) =>
              setCategoria(event.target.value)
            }
            disabled={adicionadoComSucesso || salvando}
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

        <div className="adicionar-produto-form__grupo">
          <label htmlFor="status">
            Status
          </label>

          <select
            id="status"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
            disabled={adicionadoComSucesso || salvando}
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

        <div className="adicionar-produto-form__grupo">
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
            disabled={adicionadoComSucesso || salvando}
            required
          />
        </div>

        <div className="adicionar-produto-form__grupo">
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
            placeholder="Informe a referência da imagem"
            disabled={adicionadoComSucesso || salvando}
            required
          />
        </div>

        {erroCadastro && (
          <div
            className="adicionar-produto-alert"
            role="alert"
          >
            {erroCadastro}
          </div>
        )}

        {adicionadoComSucesso && (
          <div
            className="adicionar-produto-alert"
            role="alert"
          >
            Produto adicionado! Clique em
            {' '}
            &apos;Retornar a Produtos&apos;
            {' '}
            para retornar, ou
            {' '}
            &apos;+ Adicionar Produto&apos;
            {' '}
            para cadastrar um novo produto.
          </div>
        )}

        <div className="adicionar-produto-form__acoes">
          {!adicionadoComSucesso && (
            <button
              type="submit"
              className="adicionar-produto-form__adicionar"
              disabled={salvando}
            >
              {salvando
                ? 'Salvando...'
                : '+ Adicionar Produto'}
            </button>
          )}

          {adicionadoComSucesso && (
            <button
              type="button"
              className="adicionar-produto-form__adicionar"
              onClick={handleNovoProduto}
            >
              + Adicionar Produto
            </button>
          )}

          <Link
            to="/produtos"
            className="adicionar-produto-form__retornar"
          >
            Retornar a Produtos
          </Link>
        </div>
      </form>
    </section>
  )
}

export default AdicionarProduto