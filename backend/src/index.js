require('dotenv').config()
const cors = require('cors')
const express = require('express')
const connectDB = require('./config/db')

// Inicializar app
const app = express()

//Middlewares
app.use(cors())
app.use(express.json())

// Conectar a la base de datos
connectDB()

// Cargar las rutas
app.use('/api', require('./routes/LecturasRoutes'))
app.use('/api/riego', require('./routes/RiegoRoutes'))

// Iniciar el servidor
const PORT = process.env.PORT || 3000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`)
  console.log('Esperando datos de sensores...')
})
