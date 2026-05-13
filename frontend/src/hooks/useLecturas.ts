import { useState, useEffect } from 'react'
import { Lectura } from '../model/Lecturas'
import { getHistorialLecturas } from '../services/lecturasService'

type UseLecturasResult = {
  lecturas: Lectura[] | null,
  cargando: boolean,
  error: string | null,
}

export const useLecturas = ({
}: {
  }): UseLecturasResult => {
  const [lecturas, setLecturas] = useState<Lectura[]>([])
  const [cargando, setCargando] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLecturas = async () => {
      try {
        setCargando(true)
        const datos = await getHistorialLecturas()

        setLecturas(datos)
        setCargando(false)
      } catch (err) {
        setError((err as Error).message)
      }
    }
    fetchLecturas()
  }, [])

  return { lecturas, cargando, error }
}