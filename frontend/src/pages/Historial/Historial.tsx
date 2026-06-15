import { Container, Typography, CircularProgress, Alert, Box } from '@mui/material'

import { TablaLecturas } from "../../components/TablaLecturas/TablaLecturas"
import { useLecturas } from "../../hooks/useLecturas"

import styles from "./HistorialStyle.module.css"

export const Historial = () => {
  const { lecturas, cargando, error } = useLecturas({})
  
  return (
    <Container maxWidth="lg" className={styles.container}>
      
      <Box className={styles.headerBox}>
        <Typography variant="h3" component="h1" className={styles.title}>
          Monitorización de la planta doméstica
        </Typography>
        <Typography variant="subtitle1" className={styles.subtitle}>
          Historial sobre el estado de la planta
        </Typography>
      </Box>

      {cargando ? (
        <Box className={styles.loaderBox}>
          <CircularProgress color="success" />
        </Box>
      ) : error ? (
        <Alert severity="error" className={styles.alert}>{error}</Alert>
      ) : (
        <TablaLecturas lecturas={lecturas || []} />
      )}
    </Container>
  )
}