const Lectura = require('../models/Lectura')
const Configuracion = require('../models/Configuracion')
const GeminiService = require('../services/GeminiService')

// Controlador para recibir datos de los sensores
exports.recibirDatosSensores = async (req, res) => {
  try {
    const datos = req.body
    const nuevaLectura = new Lectura(datos)
    await nuevaLectura.save()

    res.status(201).json({ message: 'Lectura guardada exitosamente' })

    // --- LÓGICA DE IA Y SEGURIDAD ---
    const config = await Configuracion.findOne()
    if (config && config.modo === 'automatico') {
      console.log("-> Evaluando seguridad para riego por IA...")

      // 1. Buscamos en la BD cuándo fue el último riego
      const ultimoRiego = await Lectura.findOne({ evento_riego: true }).sort({ timestamp: -1 })
      let textoFechaUltimoRiego = "Nunca se ha regado desde que hay registros."
      
      if (ultimoRiego) {
        textoFechaUltimoRiego = new Date(ultimoRiego.timestamp).toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })
        
        // Regla de Seguridad: Cooldown de 12 horas
        const horas = (Date.now() - new Date(ultimoRiego.timestamp).getTime()) / (1000 * 60 * 60)
        // if (horas < 12) {
        //   config.bloqueoActivo = `Se regó hace solo ${horas.toFixed(1)} horas.`
        //   await config.save()
        //   console.log(`Bloqueo de seguridad: ${config.bloqueoActivo}`)
        //   return
        // }
      }

      // 2. Regla de Seguridad: Suelo muy húmedo
      if (datos.sensores.humedad_suelo > 65) {
        config.bloqueoActivo = "El suelo ya está muy húmedo (>65%)."
        await config.save()
        console.log(`Bloqueo de seguridad: ${config.bloqueoActivo}`)
        return
      }

      // 3. Consulta a Gemini pasándole las lecturas y la fecha del último riego
      const respuestaIA = await GeminiService.evaluarRiego(datos.sensores, textoFechaUltimoRiego)
      
      config.bloqueoActivo = null
      config.justificacionIA = respuestaIA.justificacion
      
      if (respuestaIA.regar) {
        config.riegoIAPendiente = true
        console.log("La IA ha ordenado regar la planta")
      }
      await config.save()
    }

  } catch (error) {
    console.error('Error al guardar la lectura:', error)
    if (!res.headersSent) {
      res.status(500).json({ message: 'Error al guardar la lectura' })
    }
  }
}

// Controlador para obtener el historial de lecturas
exports.obtenerHistorialLecturas = async (req, res) => {
  try {
    const lecturas = await Lectura.find().sort({ timestamp: -1 })
    res.json(lecturas)
  } catch (error) {
    console.error('Error al obtener el historial de lecturas:', error)
    res.status(500).json({ message: 'Error al obtener el historial de lecturas' })
  }
}