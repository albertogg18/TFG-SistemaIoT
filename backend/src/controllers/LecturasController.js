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
      console.log("🔍 Evaluando situación para riego por IA...")

      // 1. Preparamos datos del último riego
      const ultimoRiego = await Lectura.findOne({ evento_riego: true }).sort({ timestamp: -1 })
      let textoFechaUltimoRiego = "Nunca se ha regado desde que hay registros."
      let horasDesdeUltimoRiego = 999;
      
      if (ultimoRiego) {
        textoFechaUltimoRiego = new Date(ultimoRiego.timestamp).toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })
        horasDesdeUltimoRiego = (Date.now() - new Date(ultimoRiego.timestamp).getTime()) / (1000 * 60 * 60)
      }

      // 2. SIEMPRE consultamos a Gemini para tener su opinión fresca en la web
      const respuestaIA = await GeminiService.evaluarRiego(datos.sensores, textoFechaUltimoRiego)
      config.justificacionIA = respuestaIA.justificacion
      config.bloqueoActivo = null // Lo limpiamos por defecto

      // 3. Evaluamos el Escudo de Seguridad (SIN hacer return, solo marcamos el texto del bloqueo)
      if (horasDesdeUltimoRiego < 12) {
        config.bloqueoActivo = `Protección activa: Se regó hace solo ${horasDesdeUltimoRiego.toFixed(1)} horas.`
      } else if (datos.sensores.humedad_suelo > 65) {
        config.bloqueoActivo = `Protección activa: El suelo ya está muy húmedo (>65%).`
      }

      // 4. Decisión Final: La IA quiere regar, pero... ¿Es seguro?
      if (respuestaIA.regar === true) {
        if (!config.bloqueoActivo) {
          // Si no hay bloqueos, damos luz verde a la bomba
          config.riegoIAPendiente = true
          console.log("La IA ha ordenado regar y es SEGURO. Activando bomba...")
        } else {
          // Si hay bloqueos, NO bajamos la bandera de riego
          console.log(`La IA ordenó regar, pero el sistema lo impide: ${config.bloqueoActivo}`)
        }
      } else {
        console.log("La IA ha decidido NO regar en este momento.")
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