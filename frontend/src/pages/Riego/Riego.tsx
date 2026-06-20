import React, { useState, useEffect } from 'react'
import { Box, Typography, CircularProgress } from '@mui/material'
import { OrigenRiego } from '../../model/Lecturas'
import { useRiego } from '../../hooks/useRiego'

import TouchAppIcon from '@mui/icons-material/TouchApp'
import TuneIcon from '@mui/icons-material/Tune'
import PsychologyIcon from '@mui/icons-material/Psychology'
import WaterIcon from '@mui/icons-material/Water'
import SettingsIcon from '@mui/icons-material/Settings'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'

import styles from './RiegoStyle.module.css'

export const Riego = () => {
  // Importamos la lógica de negocio desde nuestro nuevo Hook
  const {
    enviandoOrden,
    justificacionIA,
    bloqueoActivo,
    modoActivoServidor,
    configActual,
    cambiarIntervalo,
    activarReglas,
    activarManual,
    activarIA
  } = useRiego()

  // Estados estrictamente visuales y de formularios
  const [modo, setModo] = useState<OrigenRiego>(OrigenRiego.MANUAL)
  const [intervaloMuestreo, setIntervaloMuestreo] = useState<number>(30)
  const [humedadMinima, setHumedadMinima] = useState<number>(40)
  const [temperaturaMaxima, setTemperaturaMaxima] = useState<number>(40)
  const [duracionRiego, setDuracionRiego] = useState<number>(5)

  // Sincronizar los formularios con la base de datos cuando se carga la configuración
  useEffect(() => {
    if (configActual) {
      setIntervaloMuestreo(configActual.intervalo_minutos || 30)
      if (configActual.reglas) {
        setHumedadMinima(configActual.reglas.humedad_minima || 40)
        setTemperaturaMaxima(configActual.reglas.temp_maxima || 40)
        setDuracionRiego(configActual.reglas.duracion_segundos || 5)
      }
    }
  }, [configActual])

  return (
    <Box>
      <Box className={styles.headerBox}>
        <Typography variant="h3" component="h1" className={styles.title}>
          Sistema de Riego y Control
        </Typography>
        <Typography variant="subtitle1" className={styles.subtitle}>
          Configura los parámetros de monitorización y gestiona los recursos hídricos
        </Typography>
      </Box>

      {/* --- Configuración General --- */}
      <Box className={styles.generalConfigPanel}>
        <Box className="flex items-center gap-2 mb-2">
          <SettingsIcon sx={{ color: '#047857' }} />
          <Typography variant="h6" className="font-bold text-emerald-900">
            Configuración del Sistema
          </Typography>
        </Box>
        <Typography className="text-sm text-gray-500 mb-4">
          Define cada cuánto tiempo el microcontrolador debe leer los sensores y enviar datos a la nube.
        </Typography>
        
        <form 
          onSubmit={(e) => { e.preventDefault(); cambiarIntervalo(intervaloMuestreo); }} 
          className="flex flex-col sm:flex-row items-end gap-4"
        >
          <Box className={styles.inputGroup}>
            <label className={styles.label}>Intervalo de muestreo (minutos)</label>
            <input 
              type="number" min="1" className={styles.inputField} 
              value={intervaloMuestreo}
              onChange={(e) => setIntervaloMuestreo(parseInt(e.target.value) || 1)}
            />
          </Box>
          <button type="submit" className={styles.btnSecundario}>
            Aplicar Intervalo
          </button>
        </form>
      </Box>

      <Typography variant="h5" className="font-bold text-emerald-900 mb-4 mt-8 flex items-center gap-2">
        Modo de Operación
        <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full border border-gray-200 ml-2">
          Activo en servidor: <strong>{modoActivoServidor || "Cargando..."}</strong>
        </span>
      </Typography>

      {/* REJILLA DE TARJETAS DE SELECCIÓN */}
      <Box className={styles.gridModos}>
        <Box className={modo === OrigenRiego.MANUAL ? styles.cardModoActive : styles.cardModo} onClick={() => setModo(OrigenRiego.MANUAL)}>
          <Box className={modo === OrigenRiego.MANUAL ? styles.iconWrapperActive : styles.iconWrapper}><TouchAppIcon fontSize="large" /></Box>
          <Typography className={modo === OrigenRiego.MANUAL ? styles.modoTitleActive : styles.modoTitle}>Riego Manual</Typography>
          <Typography className={styles.modoDesc}>Toma el control absoluto. El agua solo se activará cuando decidas pulsar el botón.</Typography>
        </Box>

        <Box className={modo === OrigenRiego.REGLAS ? styles.cardModoActive : styles.cardModo} onClick={() => setModo(OrigenRiego.REGLAS)}>
          <Box className={modo === OrigenRiego.REGLAS ? styles.iconWrapperActive : styles.iconWrapper}><TuneIcon fontSize="large" /></Box>
          <Typography className={modo === OrigenRiego.REGLAS ? styles.modoTitleActive : styles.modoTitle}>Inteligente por Reglas</Typography>
          <Typography className={styles.modoDesc}>Define umbrales de humedad y temperatura para que el sistema riegue por ti.</Typography>
        </Box>

        <Box className={modo === OrigenRiego.AUTOMATICO ? styles.cardModoActive : styles.cardModo} onClick={() => setModo(OrigenRiego.AUTOMATICO)}>
          <Box className={modo === OrigenRiego.AUTOMATICO ? styles.iconWrapperActive : styles.iconWrapper}><PsychologyIcon fontSize="large" /></Box>
          <Typography className={modo === OrigenRiego.AUTOMATICO ? styles.modoTitleActive : styles.modoTitle}>Inteligente por IA</Typography>
          <Typography className={styles.modoDesc}>Un modelo de lenguaje avanzado decide el riego basándose en el clima y especie.</Typography>
        </Box>
      </Box>

      {/* PANEL DINÁMICO DE CONFIGURACIÓN DE RIEGO */}
      <Box className={styles.controlPanel}>
        
        {modo === OrigenRiego.MANUAL && (
          <Box className="text-center py-4">
            <Typography variant="h5" className={styles.panelTitle}>Panel de Control Manual</Typography>
            <Typography className={styles.panelDesc}>Pulsa el botón inferior para activar la bomba de agua en tiempo real.</Typography>
            <button className={styles.btnManual} onClick={activarManual} disabled={enviandoOrden} style={{ opacity: enviandoOrden ? 0.7 : 1, cursor: enviandoOrden ? 'not-allowed' : 'pointer' }}>
              {enviandoOrden ? <><CircularProgress size={20} color="inherit" /> Enviando señal...</> : <><WaterIcon /> Activar Riego Ahora</>}
            </button>
          </Box>
        )}

        {modo === OrigenRiego.REGLAS && (
          <Box>
            <Typography variant="h5" className={styles.panelTitle}>Configuración de Reglas Lógicas</Typography>
            <Typography className={styles.panelDesc}>El sistema evaluará estas tres condiciones. Si la humedad cae por debajo del mínimo, o la temperatura supera el máximo, se iniciará el riego.</Typography>
            <form 
              onSubmit={(e) => { e.preventDefault(); activarReglas(humedadMinima, temperaturaMaxima, duracionRiego); }} 
              className={styles.configGrid}
            >
              <Box className={styles.inputGroup}>
                <label className={styles.label}>Humedad del Suelo Mínima (%)</label>
                <input type="number" min="0" max="100" className={styles.inputField} value={humedadMinima} onChange={(e) => setHumedadMinima(parseInt(e.target.value) || 0)}/>
              </Box>
              <Box className={styles.inputGroup}>
                <label className={styles.label}>Temperatura Máxima (°C)</label>
                <input type="number" min="0" max="50" className={styles.inputField} value={temperaturaMaxima} onChange={(e) => setTemperaturaMaxima(parseInt(e.target.value) || 0)}/>
              </Box>
              <Box className={styles.inputGroup}>
                <label className={styles.label}>Duración del Riego (segundos)</label>
                <input type="number" min="1" className={styles.inputField} value={duracionRiego} onChange={(e) => setDuracionRiego(parseInt(e.target.value) || 0)}/>
              </Box>
              <Box className="sm:col-span-1 flex items-end">
                <button type="submit" disabled={enviandoOrden} className={`${styles.btnGuardar} w-full`}>
                  {enviandoOrden ? 'Guardando...' : 'Guardar y Activar Reglas'}
                </button>
              </Box>
            </form>
          </Box>
        )}

        {modo === OrigenRiego.AUTOMATICO && (
          <Box className="py-2">
            <Typography variant="h5" className={styles.panelTitle}>Modelo de Razonamiento LLM</Typography>
            <span className={styles.iaBadge}>Google Gemini Engine Online</span>
            <Typography className="text-gray-600 mt-4 leading-relaxed text-sm mb-6">
              En este modo, las decisiones de riego y el análisis de la telemetría han sido delegadas al modelo fundacional de Google, contextualizado para botánica.
            </Typography>
            
            <Box className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-5 rounded-2xl mb-6 shadow-inner">
              <Box className="flex items-center gap-2 mb-2">
                <AutoAwesomeIcon sx={{ color: '#059669', fontSize: 20 }} />
                <Typography variant="subtitle2" className="font-bold text-emerald-900 uppercase tracking-wider text-xs">
                   Última evaluación de la IA:
                </Typography>
              </Box>
              <Typography className="text-base text-emerald-800 italic font-medium">
                "{justificacionIA}"
              </Typography>
            </Box>

            {bloqueoActivo && (
              <Box className="bg-orange-50 border border-orange-200 p-4 rounded-xl mb-6 flex items-start gap-3 shadow-sm">
                <Typography variant="body1" className="text-orange-500 mt-0.5">🔒</Typography>
                <Box>
                  <Typography variant="subtitle2" className="font-bold text-orange-900 uppercase tracking-wider text-xs mb-1">
                    Bloqueo de Seguridad Activo
                  </Typography>
                  <Typography className="text-sm text-orange-800 font-medium">
                    El sistema entra en reposo. {bloqueoActivo}
                  </Typography>
                </Box>
              </Box>
            )}

            <button 
               className={styles.btnGuardar} 
               onClick={activarIA}
              disabled={enviandoOrden}
            >
              {enviandoOrden ? 'Activando...' : 'Activar Inteligencia Artificial'}
            </button>
          </Box>
        )}
      </Box>
    </Box>
  )
}