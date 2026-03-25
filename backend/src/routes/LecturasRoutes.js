const express = require('express');
const router = express.Router();
const lecturasController = require('../controllers/LecturasController');

// Ruta para guardar una nueva lectura
router.post('/sensores', lecturasController.recibirDatosSensores);

module.exports = router;