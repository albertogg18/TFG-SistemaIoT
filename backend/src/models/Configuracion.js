const mongoose = require('mongoose')

const configuracionSchema = new mongoose.Schema({
  modo: { type: String, enum: ['manual', 'reglas', 'automatico'], default: 'manual' },
  intervaloMuestreo: { type: Number, default: 30 },
  reglas: {
    humedadMinima: { type: Number, default: 40 },
    temperaturaMaxima: { type: Number, default: 40 },
    duracionRiego: { type: Number, default: 5 }
  },
  riegoManualPendiente: { type: Boolean, default: false },
  riegoIAPendiente: { type: Boolean, default: false },
  justificacionIA: { type: String, default: "Esperando evaluación..." }
})

module.exports = mongoose.model('Configuracion', configuracionSchema)