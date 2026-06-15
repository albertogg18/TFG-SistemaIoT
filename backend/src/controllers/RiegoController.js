// Objeto global que actúa como la "memoria" del sistema
let estadoSistema = {
  modo: 'manual',
  intervaloMuestreo: 30, 
  reglas: {
    humedadMinima: 40,
    temperaturaMaxima: 40,
    duracionRiego: 5 
  },
  riegoManualPendiente: false
}

exports.activarRiegoManual = async (req, res) => {
  try {  
    estadoSistema.riegoManualPendiente = true
    console.log("💧 Orden de riego manual recibida desde la web.")
    res.status(200).json({ message: 'Riego manual activado' })
  } catch (error) {
    console.error("Error al activar riego manual:", error)
    res.status(500).json({ message: 'Error al activar riego manual' })
  }
}

exports.actualizarConfiguracion = async (req, res) => {
  try {
    const { modo, intervaloMuestreo, reglas } = req.body;

    // Actualizamos solo los datos que nos envíe el frontend
    if (modo) estadoSistema.modo = modo
    if (intervaloMuestreo) estadoSistema.intervaloMuestreo = intervaloMuestreo
    
    if (reglas) {
      if (reglas.humedadMinima !== undefined) estadoSistema.reglas.humedadMinima = reglas.humedadMinima
      if (reglas.temperaturaMaxima !== undefined) estadoSistema.reglas.temperaturaMaxima = reglas.temperaturaMaxima
      if (reglas.duracionRiego !== undefined) estadoSistema.reglas.duracionRiego = reglas.duracionRiego
    }

    console.log("Nueva configuración del sistema guardada:", estadoSistema)
    res.status(200).json({ message: 'Configuración actualizada correctamente', estado: estadoSistema })
  } catch (error) {
    console.error("Error al actualizar la configuración:", error)
    res.status(500).json({ message: 'Error al actualizar la configuración' })
  }
}


exports.verificarEstadoRiego = async (req, res) => {
  try {
    const debeRegarManual = estadoSistema.riegoManualPendiente;
    
    // Si el ESP32 lee la orden manual, bajamos la bandera para que no riegue infinito
    if (estadoSistema.riegoManualPendiente) {
        estadoSistema.riegoManualPendiente = false
        console.log("📡 ESP32 ha consumido la orden de riego manual.")
    }

    // Le devolvemos al ESP32 TODA la configuración de golpe
    res.json({
      regar: debeRegarManual,
      modo: estadoSistema.modo,
      intervalo_minutos: estadoSistema.intervaloMuestreo,
      reglas: {
        humedad_minima: estadoSistema.reglas.humedadMinima,
        temp_maxima: estadoSistema.reglas.temperaturaMaxima,
        duracion_segundos: estadoSistema.reglas.duracionRiego
      }
    })
  } catch (error) {
    console.error("Error al verificar estado del sistema:", error)
    res.status(500).json({ message: 'Error al verificar estado del sistema' })
  }
}