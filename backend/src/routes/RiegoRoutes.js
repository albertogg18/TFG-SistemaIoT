const express = require('express')
const router = express.Router()
const riegoController = require('../controllers/RiegoController')

// Petición POST para frontend
router.post('/activar', riegoController.activarRiegoManual)
router.post('/config', riegoController.actualizarConfiguracion)
router.get('/estado', riegoController.verificarEstadoRiego)

module.exports = router