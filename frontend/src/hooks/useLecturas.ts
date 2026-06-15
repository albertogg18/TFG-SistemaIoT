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
    const fetchLecturas = async (esPrimeraCarga: boolean) => {
      try {
        if (esPrimeraCarga) {
          setCargando(true)
        }
        
        const datos = await getHistorialLecturas()
        
        setLecturas(datos)
        setError(null)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        if (esPrimeraCarga) {
          setCargando(false)
        }
      }
    }

    fetchLecturas(true)

    const intervalo = setInterval(() => {
      fetchLecturas(false)
    }, 15000)

    return () => clearInterval(intervalo)
  }, [])

  return { lecturas, cargando, error }
}