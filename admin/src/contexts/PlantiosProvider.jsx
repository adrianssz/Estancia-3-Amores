import {
  useEffect,
  useState,
} from 'react'

import { supabase } from '../services/supabase'
import { useAuth } from './AuthContext'
import PlantiosContext from './PlantiosContext'

function PlantiosProvider({ children }) {
  const {
    autenticado,
    carregando: carregandoAutenticacao,
  } = useAuth()

  const [plantios, setPlantios] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    let ativo = true

    async function carregarPlantios() {
      if (carregandoAutenticacao) {
        return
      }

      if (!autenticado) {
        if (ativo) {
          setPlantios([])
          setErro('')
          setCarregando(false)
        }

        return
      }

      setCarregando(true)
      setErro('')

      const {
        data,
        error,
      } = await supabase
        .from('plantios')
        .select(
          'id, nome, tipo, area, quantidade'
        )
        .order('id', {
          ascending: true,
        })

      if (!ativo) {
        return
      }

      if (error) {
        setPlantios([])
        setErro(
          'Não foi possível carregar os plantios.'
        )
        setCarregando(false)
        return
      }

      setPlantios(data ?? [])
      setCarregando(false)
    }

    carregarPlantios()

    return () => {
      ativo = false
    }
  }, [
    autenticado,
    carregandoAutenticacao,
  ])

  async function adicionarPlantio(novoPlantio) {
    const {
      data,
      error,
    } = await supabase
      .from('plantios')
      .insert({
        nome: novoPlantio.nome,
        tipo: novoPlantio.tipo,
        area: novoPlantio.area,
        quantidade: novoPlantio.quantidade,
      })
      .select(
        'id, nome, tipo, area, quantidade'
      )
      .single()

    if (error) {
      return {
        sucesso: false,
        mensagem:
          'Não foi possível adicionar o plantio.',
      }
    }

    setPlantios((plantiosAtuais) => [
      ...plantiosAtuais,
      data,
    ])

    return {
      sucesso: true,
      plantio: data,
    }
  }

  async function editarPlantio(
    id,
    dadosAtualizados
  ) {
    const {
      data,
      error,
    } = await supabase
      .from('plantios')
      .update({
        nome: dadosAtualizados.nome,
        tipo: dadosAtualizados.tipo,
        area: dadosAtualizados.area,
        quantidade: dadosAtualizados.quantidade,
      })
      .eq('id', id)
      .select(
        'id, nome, tipo, area, quantidade'
      )
      .single()

    if (error) {
      return {
        sucesso: false,
        mensagem:
          'Não foi possível editar o plantio.',
      }
    }

    setPlantios((plantiosAtuais) =>
      plantiosAtuais.map((plantio) =>
        plantio.id === id
          ? data
          : plantio
      )
    )

    return {
      sucesso: true,
      plantio: data,
    }
  }

  async function excluirPlantio(id) {
    const { error } = await supabase
      .from('plantios')
      .delete()
      .eq('id', id)

    if (error) {
      return {
        sucesso: false,
        mensagem:
          'Não foi possível excluir o plantio.',
      }
    }

    setPlantios((plantiosAtuais) =>
      plantiosAtuais.filter(
        (plantio) => plantio.id !== id
      )
    )

    return {
      sucesso: true,
    }
  }

  return (
    <PlantiosContext.Provider
      value={{
        plantios,
        carregando,
        erro,
        adicionarPlantio,
        editarPlantio,
        excluirPlantio,
      }}
    >
      {children}
    </PlantiosContext.Provider>
  )
}

export default PlantiosProvider