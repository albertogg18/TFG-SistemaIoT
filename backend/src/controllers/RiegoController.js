let riegoPendiente = false

exports.activarRiegoManual = async (req, res) => {
  try {  
    riegoPendiente = true
    console.log("Orden de riego manual recibida")
    res.status(200).json({ message: 'Riego manual activado' })
  } catch (error) {
    console.error("Error al activar riego manual:", error)
    res.status(500).json({ message: 'Error al activar riego manual' })
  }
}

exports.verificarEstadoRiego = async (req, res) => {
  try {
    const debeRegar = riegoPendiente
    if (riegoPendiente) {
        riegoPendiente = false
        console.log("ESP32 ha verificado el estado de riego: Riego activado")
    }
    res.json({regar: debeRegar})
  } catch (error) {
    console.error("Error al verificar estado de riego:", error)
    res.status(500).json({ message: 'Error al verificar estado de riego' })
  }
}