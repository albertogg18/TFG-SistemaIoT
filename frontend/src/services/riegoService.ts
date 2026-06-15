import { ConfiguracionSistema } from "../model/Configuracion"

const API_URL = 'https://backend-tfg-mvvy.onrender.com/api/riego'

export const activarRiegoManual = async (): Promise<boolean> => {
  try {
    const respuesta = await fetch(`${API_URL}/activar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return respuesta.ok
  } catch (error) {
    console.error("Error al activar riego manual:", error)
    return false
  }
}

export const actualizarConfiguracion = async (datosConfiguracion: ConfiguracionSistema): Promise<boolean> => {
  try {
    const respuesta = await fetch(`${API_URL}/config`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datosConfiguracion)
    });
    return respuesta.ok;
  } catch (error) {
    console.error("Error al actualizar configuración:", error);
    return false;
  }
}