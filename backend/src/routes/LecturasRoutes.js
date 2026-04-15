const express = require('express');
const router = express.Router();
const lecturasController = require('../controllers/LecturasController');

// Ruta para guardar una nueva lectura
router.post('/sensores', lecturasController.recibirDatosSensores);
// Ruta para obtener el historial
router.get('/sensores/historial', lecturasController.obtenerHistorialLecturas);

module.exports = router;