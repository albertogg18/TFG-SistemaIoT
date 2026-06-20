const Configuracion = require('../models/Configuracion')

exports.activarRiegoManual = async (req, res) => {
  try {  
    // Buscamos el único documento de configuración y lo actualizamos
    await Configuracion.findOneAndUpdate({}, { 
        riegoManualPendiente: true, 
        modo: 'manual'
    })
    
    console.log("Orden de riego manual recibida desde la web y guardada en BD.")
    res.status(200).json({ message: 'Riego manual activado' })
  } catch (error) {
    console.error("Error al activar riego manual:", error)
    res.status(500).json({ message: 'Error al activar riego manual' })
  }
}

exports.actualizarConfiguracion = async (req, res) => {
  try {
    const { modo, intervaloMuestreo, reglas } = req.body
    
    // Obtenemos la configuración actual desde MongoDB
    const config = await Configuracion.findOne()

    if (!config) {
        return res.status(404).json({ message: 'No se encontró la configuración en BD' })
    }

    // Actualizamos solo los datos que nos envíe el frontend
    if (modo) config.modo = modo
    if (intervaloMuestreo) config.intervaloMuestreo = intervaloMuestreo
    
    if (reglas) {
      if (reglas.humedadMinima !== undefined) config.reglas.humedadMinima = reglas.humedadMinima
      if (reglas.temperaturaMaxima !== undefined) config.reglas.temperaturaMaxima = reglas.temperaturaMaxima
      if (reglas.duracionRiego !== undefined) config.reglas.duracionRiego = reglas.duracionRiego
    }

    // Guardamos los cambios en la base de datos
    await config.save()
    
    console.log(`Configuración actualizada en BD. Modo actual: ${config.modo}`)
    res.status(200).json({ message: 'Configuración actualizada correctamente', estado: config })
  } catch (error) {
    console.error("Error al actualizar la configuración:", error)
    res.status(500).json({ message: 'Error al actualizar la configuración' })
  }
}

exports.verificarEstadoRiego = async (req, res) => {
  try {
    const config = await Configuracion.findOne()
    
    if (!config) {
        return res.status(404).json({ message: 'Configuración no inicializada' })
    }

    const debeRegar = config.riegoManualPendiente || config.riegoIAPendiente
    
    let origen = null
    if (config.riegoManualPendiente) origen = "manual"
    if (config.riegoIAPendiente) origen = "automatico"

    // Si el ESP32 hace el polling y hay orden de regar, bajamos las banderas en MongoDB
    if (debeRegar) {
        config.riegoManualPendiente = false
        config.riegoIAPendiente = false
        await config.save()
        console.log(`ESP32 ha consumido la orden de riego (${origen}). Banderas bajadas en BD.`)
    }

    // Le devolvemos al ESP32 TODA la configuración, incluyendo la justificación de la IA para la Web
    res.json({
      regar: debeRegar,
      origen_orden: origen,
      modo: config.modo,
      intervalo_minutos: config.intervaloMuestreo,
      justificacion_ia: config.justificacionIA,
      bloqueo_activo: config.bloqueoActivo,
      reglas: {
        humedad_minima: config.reglas.humedadMinima,
        temp_maxima: config.reglas.temperaturaMaxima,
        duracion_segundos: config.reglas.duracionRiego
      }
    })
  } catch (error) {
    console.error("Error al verificar estado del sistema:", error)
    res.status(500).json({ message: 'Error al verificar estado del sistema' })
  }
}