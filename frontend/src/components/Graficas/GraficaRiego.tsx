import { useMemo } from 'react'
import { Lectura } from '../../model/Lecturas'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Box, Typography } from '@mui/material'
import styles from './GraficaRiegoStyle.module.css'

export const GraficaRiegoMensual = ({ lecturas }: { lecturas: Lectura[] }) => {

  const { datosGrafico, diasConRiego, totalRiegos } = useMemo(() => {
    const mapaDias = new Map<string, { diaMes: string; vecesRegado: number }>()

    for (let i = 29; i >= 0; i--) {
      const fecha = new Date()
      fecha.setDate(fecha.getDate() - i)

      const year = fecha.getFullYear()
      const month = (fecha.getMonth() + 1).toString().padStart(2, '0')
      const day = fecha.getDate().toString().padStart(2, '0')
      const claveUnica = `${year}-${month}-${day}`

      const diaMes = `${day}/${month}`
      mapaDias.set(claveUnica, { diaMes, vecesRegado: 0 })
    }

    let cuentaTotalRiegos = 0
    let cuentaDiasConRiego = 0

    lecturas.forEach((l) => {
      const fechaLectura = new Date(l.timestamp)
      const year = fechaLectura.getFullYear()
      const month = (fechaLectura.getMonth() + 1).toString().padStart(2, '0')
      const day = fechaLectura.getDate().toString().padStart(2, '0')
      const claveUnica = `${year}-${month}-${day}`

      if (mapaDias.has(claveUnica) && l.evento_riego) {
        mapaDias.get(claveUnica)!.vecesRegado += 1
      }
    })

    const resultadoArray = Array.from(mapaDias.values()).map(d => {
      if (d.vecesRegado > 0) {
        cuentaTotalRiegos += d.vecesRegado
        cuentaDiasConRiego += 1
      }
      return d
    })

    return {
      datosGrafico: resultadoArray,
      diasConRiego: cuentaDiasConRiego,
      totalRiegos: cuentaTotalRiegos
    }
  }, [lecturas])

  return (
    <Box className={styles.card}>
      <Typography className={styles.title}>
        Registro Mensual de Riegos (Últimos 30 días)
      </Typography>

      <Box className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={datosGrafico} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis
              dataKey="diaMes"
              stroke="#6b7280"
              tick={{ fontSize: 11 }}
              tickMargin={8}
              minTickGap={15}
            />
            <YAxis
              stroke="#6b7280"
              tick={{ fontSize: 12 }}
              allowDecimals={false}
              domain={[0, 'auto']}
            />
            <Tooltip
              cursor={{ fill: '#f0f9ff' }}
              contentStyle={{ borderRadius: '0.75rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              formatter={(value) => [`${value} veces`, 'Riegos registrados']}
              labelFormatter={(label) => `Día: ${label}`}
            />
            <Bar
              dataKey="vecesRegado"
              name="Riegos"
              fill="#0ea5e9"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {/* Panel inferior con métricas agregadas */}
      <Box className={styles.summaryBox}>
        <Box className={styles.summaryItem}>
          <Typography className={styles.summaryLabel}>Frecuencia Mensual</Typography>
          <Typography className={styles.summaryValue}>
            {diasConRiego} de 30 días regados
          </Typography>
        </Box>
        <Box className={styles.summaryItem}>
          <Typography className={styles.summaryLabel}>Activaciones Totales</Typography>
          <Typography className={styles.summaryValue}>
            {totalRiegos} ejecuciones de riego
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}