import { Lectura } from "../model/Lecturas"

const API_URL = 'https://backend-tfg-mvvy.onrender.com/api/sensores'

export const getHistorialLecturas = async (): Promise<Lectura[]> => {
  const respuesta = await fetch(`${API_URL}/historial`)

  if (!respuesta.ok) {
    throw new Error('Error al obtener el historial de lecturas')
  }

  const datos = await respuesta.json()
  return datos as Lectura[]
}