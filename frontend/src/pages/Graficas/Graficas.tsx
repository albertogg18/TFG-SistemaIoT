import { Alert, Box, CircularProgress, Typography } from '@mui/material'
import styles from './GraficasStyle.module.css'
import { useLecturas } from '../../hooks/useLecturas'
import { GraficaEvolucion } from '../../components/Graficas/GraficaEvolucion'
import { GraficaRiegoMensual } from '../../components/Graficas/GraficaRiego'

export const Graficas = () => {
  
  const { lecturas, cargando, error } = useLecturas({})
    return (
    <Box>
      <Box className={styles.headerBox}>
        <Typography variant="h3" component="h1" className={styles.title}>
          Análisis Gráfico
        </Typography>
        <Typography variant="subtitle1" className={styles.subtitle}>
          Comparativa visual de temperatura, humedad y luminosidad
        </Typography>
      </Box>

      {cargando ? (
        <Box className="flex justify-center mt-10">
          <CircularProgress color="success" />
        </Box>
      ) : error ? (
        <Alert severity="error" className="rounded-xl">{error}</Alert>
      ) : (
        <Box>
          <GraficaEvolucion lecturas={lecturas || []} />
          <GraficaRiegoMensual lecturas={lecturas || []} />
        </Box>
      )}
    </Box>
  )
}