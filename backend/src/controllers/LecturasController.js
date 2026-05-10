const Lectura = require('../models/Lectura')

// Controlador para recibir datos de los sensores
exports.recibirDatosSensores = async (req, res) => {
    try {
        const nuevaLectura = new Lectura(req.body)
        await nuevaLectura.save()
        res.status(201).json({ message: 'Lectura guardada exitosamente' })
    } catch (error) {
        console.error('Error al guardar la lectura:', error)
        res.status(500).json({ message: 'Error al guardar la lectura' })
    }
}

// Controlador para obtener el historial de lecturas
exports.obtenerHistorialLecturas = async (req, res) => {
    try {
        const lecturas = await Lectura.find().sort({timestamp: -1})
        res.json(lecturas)
    } catch (error) {
        console.error('Error al obtener el historial de lecturas:', error)
        res.status(500).json({ message: 'Error al obtener el historial de lecturas' })
    }
}