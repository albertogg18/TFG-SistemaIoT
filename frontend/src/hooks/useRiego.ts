import { useState, useEffect, useCallback } from 'react'
import { OrigenRiego } from '../model/Lecturas'
import { activarRiegoManual, actualizarConfiguracion, getEstadoSistema } from '../services/riegoService'

export const useRiego = () => {
  const [enviandoOrden, setEnviandoOrden] = useState<boolean>(false)
  const [justificacionIA, setJustificacionIA] = useState<string>("Sincronizando con el servidor...")
  const [bloqueoActivo, setBloqueoActivo] = useState<string | null>(null)
  const [modoActivoServidor, setModoActivoServidor] = useState<string>("")
  
  const [configActual, setConfigActual] = useState<any>(null)

  const fetchEstado = useCallback(async () => {
    const estado = await getEstadoSistema()
    if (estado) {
      setJustificacionIA(estado.justificacion_ia || "Esperando evaluación...")
      setBloqueoActivo(estado.bloqueo_activo || null)
      setModoActivoServidor(estado.modo)
      setConfigActual(estado)
    }
  }, [])

  useEffect(() => {
    fetchEstado()
    const intervalo = setInterval(fetchEstado, 15000)
    return () => clearInterval(intervalo)
  }, [fetchEstado])

  const cambiarIntervalo = async (intervalo: number) => {
    setEnviandoOrden(true)
    const exito = await actualizarConfiguracion({ intervaloMuestreo: intervalo })
    if (exito) alert(`Intervalo de muestreo actualizado a: ${intervalo} minutos.`)
    else alert(`Error al guardar el intervalo en el servidor.`)
    await fetchEstado()
    setEnviandoOrden(false)
  }

  const activarReglas = async (humedad: number, temp: number, duracion: number) => {
    setEnviandoOrden(true)
    const exito = await actualizarConfiguracion({
      modo: OrigenRiego.REGLAS,
      reglas: { humedadMinima: humedad, temperaturaMaxima: temp, duracionRiego: duracion }
    })
    if (exito) {
      alert(`Reglas guardadas y Modo Inteligente activado.`)
      await fetchEstado()
    } else alert(`Error al guardar las reglas.`)
    setEnviandoOrden(false)
  }

  const activarManual = async () => {
    try {
      setEnviandoOrden(true)
      const exito = await activarRiegoManual()
      if (exito) {
        alert('Orden enviada correctamente. La bomba se activará en breves segundos.')
        await fetchEstado()
      } else throw new Error()
    } catch (error) {
      alert('Error de comunicación con el servidor. No se pudo activar el riego.')
    } finally {
      setEnviandoOrden(false)
    }
  }

  const activarIA = async () => {
    setEnviandoOrden(true)
    const exito = await actualizarConfiguracion({ modo: OrigenRiego.AUTOMATICO })
    if (exito) {
      alert('Modo Inteligencia Artificial activado. El sistema evaluará en la próxima lectura.')
      await fetchEstado()
    } else alert('Error al activar el modo IA.')
    setEnviandoOrden(false)
  }

  return {
    enviandoOrden,
    justificacionIA,
    bloqueoActivo,
    modoActivoServidor,
    configActual,
    cambiarIntervalo,
    activarReglas,
    activarManual,
    activarIA
  }
}