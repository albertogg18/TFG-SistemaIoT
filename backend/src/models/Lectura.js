const mongoose = require('mongoose');

// Definición del esquema para las lecturas de sensores
const lecturaSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    dispositivo_id: { type: String, required: true },
    sensores: {
        temperatura: Number,
        humedad_aire: Number,
        humedad_suelo: Number,
        luminosidad: Number
    },
    evento_riego: { type: Boolean, default: false },
    origen_riego: { type: String, enum: ['manual', 'reglas', 'automatico', null], default: null }
},{
    collection: 'lecturas_sensores',
    versionKey: false
})

module.exports = mongoose.model('Lectura', lecturaSchema);