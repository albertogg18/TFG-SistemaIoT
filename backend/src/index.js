require('dotenv').config()
const cors = require('cors')
const express = require('express')
const connectDB = require('./config/db')
const Configuracion = require('./models/Configuracion')

// Inicializar app
const app = express()

//Middlewares
app.use(cors())
app.use(express.json())

const inicializarConfiguracion = async () => {
  try {
    const config = await Configuracion.findOne()
    if (!config) {
      console.log('Creando documento inicial de configuración en MongoDB...')
      await Configuracion.create({})
    } else {
      console.log('Configuración cargada desde MongoDB.')
    }
  } catch (error) {
    console.error('Error al inicializar la configuración:', error)
  }
}

// Conectar a la base de datos
connectDB().then(() => {
    inicializarConfiguracion();
})

// Cargar las rutas
app.use('/api', require('./routes/LecturasRoutes'))
app.use('/api/riego', require('./routes/RiegoRoutes'))

// Iniciar el servidor
const PORT = process.env.PORT || 3000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`)
  console.log('Esperando datos de sensores...')
})
