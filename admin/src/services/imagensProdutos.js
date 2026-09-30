import { supabase } from './supabase'

const BUCKET = 'produtos'
const TAMANHO_MAXIMO = 5 * 1024 * 1024

const EXTENSOES_POR_TIPO = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
}

export function validarImagemProduto(arquivo) {
  if (!arquivo) {
    return
  }

  if (!EXTENSOES_POR_TIPO[arquivo.type]) {
    throw new Error(
      'Selecione uma imagem JPG, JPEG ou PNG.'
    )
  }

  if (arquivo.size === 0) {
    throw new Error(
      'A imagem selecionada está vazia.'
    )
  }

  if (arquivo.size > TAMANHO_MAXIMO) {
    throw new Error(
      'A imagem deve ter no máximo 5 MB.'
    )
  }
}

export async function enviarImagemProduto(arquivo) {
  validarImagemProduto(arquivo)

  if (!arquivo) {
    return ''
  }

  const extensao = EXTENSOES_POR_TIPO[arquivo.type]
  const caminho =
    `uploads/${crypto.randomUUID()}.${extensao}`

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(caminho, arquivo, {
      contentType: arquivo.type,
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    console.error('Erro ao enviar imagem:', error)

    throw new Error(
      'Não foi possível enviar a imagem. Tente novamente.'
    )
  }

  const { data } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(caminho)

  return data.publicUrl
}

export function extrairCaminhoImagemProduto(url) {
  if (typeof url !== 'string' || !url) {
    return null
  }

  const { data } = supabase.storage
    .from(BUCKET)
    .getPublicUrl('')

  if (!url.startsWith(data.publicUrl)) {
    return null
  }

  const caminho = url.slice(data.publicUrl.length)

  // Remove somente arquivos gerados pelo upload deste admin.
  const formato =
    /^uploads\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png)$/

  return formato.test(caminho) ? caminho : null
}

export async function removerImagemProduto(url) {
  const caminho = extrairCaminhoImagemProduto(url)

  if (!caminho) {
    return
  }

  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([caminho])

  if (error) {
    throw error
  }
}