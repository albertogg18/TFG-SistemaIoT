import React, { useMemo, useState } from 'react'
import { Lectura } from '../../model/Lecturas'
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts'
import { Box, Typography, FormGroup, FormControlLabel, Checkbox } from '@mui/material'
import styles from './GraficaEvolucionStyle.module.css'

export const GraficaEvolucion = ({ lecturas }: { lecturas: Lectura[] }) => {
  const [visibilidad, setVisibilidad] = useState({
    temperatura: true,
    humedadAire: true,
    humedadSuelo: true,
    luminosidad: false, 
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVisibilidad({
      ...visibilidad,
      [event.target.name]: event.target.checked,
    })
  }

  const datosProcesados = useMemo(() => {
    if (!lecturas || lecturas.length === 0) return []

    const fechaLimite = new Date()
    fechaLimite.setDate(fechaLimite.getDate() - 30)

    return lecturas
      .filter(l => new Date(l.timestamp) >= fechaLimite)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .map(l => {
        const fecha = new Date(l.timestamp)
        const diaMes = `${fecha.getDate().toString().padStart(2, '0')}/${(fecha.getMonth() + 1).toString().padStart(2, '0')}`
        const hora = `${fecha.getHours().toString().padStart(2, '0')}:${fecha.getMinutes().toString().padStart(2, '0')}`
        
        return {
          diaMes,
          fechaHoraCompleta: `${diaMes} ${hora}`,
          temperatura: l.sensores.temperatura,
          humedadAire: l.sensores.humedad_aire,
          humedadSuelo: l.sensores.humedad_suelo,
          luminosidad: l.sensores.luminosidad
        }
      })
  }, [lecturas])

  return (
    <Box className={styles.card}>
      <Box className={styles.header}>
        <Typography className={styles.title}>
          Evolución de Sensores (Últimos 30 días)
        </Typography>

        <FormGroup className={styles.controlsGroup} row>
          <FormControlLabel
            control={<Checkbox checked={visibilidad.temperatura} onChange={handleChange} name="temperatura" sx={{ color: '#ef4444', '&.Mui-checked': { color: '#ef4444' } }} />}
            label={<span className="text-sm font-medium text-gray-700">Temp.</span>}
          />
          <FormControlLabel
            control={<Checkbox checked={visibilidad.humedadAire} onChange={handleChange} name="humedadAire" sx={{ color: '#3b82f6', '&.Mui-checked': { color: '#3b82f6' } }} />}
            label={<span className="text-sm font-medium text-gray-700">Hum. Aire</span>}
          />
          <FormControlLabel
            control={<Checkbox checked={visibilidad.humedadSuelo} onChange={handleChange} name="humedadSuelo" sx={{ color: '#8b5cf6', '&.Mui-checked': { color: '#8b5cf6' } }} />}
            label={<span className="text-sm font-medium text-gray-700">Hum. Suelo</span>}
          />
          <FormControlLabel
            control={<Checkbox checked={visibilidad.luminosidad} onChange={handleChange} name="luminosidad" sx={{ color: '#eab308', '&.Mui-checked': { color: '#eab308' } }} />}
            label={<span className="text-sm font-medium text-gray-700">Luminosidad</span>}
          />
        </FormGroup>
      </Box>

      <Box className={styles.chartContainer}>
        {datosProcesados.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={datosProcesados} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              
              {/* Eje X mejorado: usa el dato corto y minTickGap evita apelotonamientos */}
              <XAxis 
                dataKey="diaMes" 
                stroke="#6b7280" 
                tick={{ fontSize: 12 }} 
                tickMargin={10} 
                minTickGap={40} 
              />
              
              <YAxis yAxisId="left" stroke="#6b7280" tick={{ fontSize: 12 }} domain={[0, 'auto']} />
              
              {visibilidad.luminosidad && (
                <YAxis yAxisId="right" orientation="right" stroke="#eab308" tick={{ fontSize: 12 }} />
              )}

              {/* Tooltip mejorado: formatea la etiqueta superior para mostrar la hora exacta */}
              <Tooltip 
                labelFormatter={(label, payload) => {
                  if (payload && payload.length > 0) {
                    return payload[0].payload.fechaHoraCompleta
                  }
                  return label
                }}
                contentStyle={{ borderRadius: '0.75rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="top" height={36} />

              {visibilidad.temperatura && (
                <Line yAxisId="left" type="monotone" dataKey="temperatura" name="Temperatura (°C)" stroke="#ef4444" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
              )}
              {visibilidad.humedadAire && (
                <Line yAxisId="left" type="monotone" dataKey="humedadAire" name="Hum. Aire (%)" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
              )}
              {visibilidad.humedadSuelo && (
                <Line yAxisId="left" type="monotone" dataKey="humedadSuelo" name="Hum. Suelo (%)" stroke="#8b5cf6" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
              )}
              {visibilidad.luminosidad && (
                <Line yAxisId="right" type="monotone" dataKey="luminosidad" name="Luz (lux)" stroke="#eab308" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
              )}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <Box className="w-full h-full flex items-center justify-center text-gray-500">
            No hay datos en los últimos 30 días.
          </Box>
        )}
      </Box>
    </Box>
  )
}