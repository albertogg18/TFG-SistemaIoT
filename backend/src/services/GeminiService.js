const { GoogleGenerativeAI } = require("@google/generative-ai")

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

exports.evaluarRiego = async (sensores, fechaUltimoRiego) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    const fechaActual = new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })

    const prompt = `
      Actúa como un ingeniero agrónomo experto encargado de decidir cuándo regar una plantación.

      Contexto de la planta:
      - Especie: Albahaca (Ocimum basilicum).
      - Entorno y condiciones: Está sembrada en una maceta pequeña de vivero. Se encuentra situada en un balcón dando a la calle, donde recibe luz solar directa.

      Datos actuales recogidos por los sensores:
      - Temperatura: ${sensores.temperatura} ºC
      - Humedad ambiente: ${sensores.humedad_aire} %
      - Humedad del suelo: ${sensores.humedad_suelo} %
      - Luminosidad: ${sensores.luminosidad} lux

      Contexto temporal:
      - Fecha y hora actual: ${fechaActual}
      - Último riego realizado: ${fechaUltimoRiego}

      Basándote en estos datos botánicos y ambientales, ¿consideras apropiado que se riegue la planta ahora mismo?

      Para responder, hazlo ÚNICAMENTE con un objeto JSON válido con el siguiente formato exacto:
      {
        "regar": true o false,
        "justificacion": "Explicación técnica de 1 o 2 líneas justificando tu decisión basándote en los datos."
      }
      No incluyas texto adicional ni bloques markdown.
    `

    console.log("Consultando a Gemini con contexto temporal y botánico...")
    const result = await model.generateContent(prompt)
    let textoRespuesta = result.response.text().trim()

    textoRespuesta = textoRespuesta.replace(/```json/g, '').replace(/```/g, '').trim()

    const jsonIA = JSON.parse(textoRespuesta)
    console.log("Respuesta Gemini:", jsonIA)

    return {
        regar: jsonIA.regar === true,
        justificacion: jsonIA.justificacion || "Decisión tomada sin justificación."
    }

  } catch (error) {
    console.error("Error con Gemini:", error)
    return { regar: false, justificacion: "Error de conexión con la IA." }
  }
}