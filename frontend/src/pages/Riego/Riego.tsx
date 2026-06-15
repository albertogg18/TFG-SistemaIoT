import React, { useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { OrigenRiego } from '../../model/Lecturas';
import { activarRiegoManual, actualizarConfiguracion } from '../../services/riegoService';
import { ConfiguracionSistema } from '../../model/Configuracion'

// Iconos
import TouchAppIcon from '@mui/icons-material/TouchApp';
import TuneIcon from '@mui/icons-material/Tune';
import PsychologyIcon from '@mui/icons-material/Psychology';
import WaterIcon from '@mui/icons-material/Water';
import SettingsIcon from '@mui/icons-material/Settings';

import styles from './RiegoStyle.module.css';

export const Riego = () => {
  const [modo, setModo] = useState<OrigenRiego>(OrigenRiego.MANUAL);
  const [enviandoOrden, setEnviandoOrden] = useState<boolean>(false);

  // --- Estado para Configuración General ---
  const [intervaloMuestreo, setIntervaloMuestreo] = useState<number>(30); // 30 minutos por defecto

  // --- Estados para el formulario de reglas ---
  const [humedadMinima, setHumedadMinima] = useState<number>(40);
  const [temperaturaMaxima, setTemperaturaMaxima] = useState<number>(40);
  const [duracionRiego, setDuracionRiego] = useState<number>(5);

  // Manejador del Intervalo de Muestreo
  const manejarGuardarIntervalo = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviandoOrden(true); 

    const payload: ConfiguracionSistema = { 
      intervaloMuestreo: intervaloMuestreo 
    };

    const exito = await actualizarConfiguracion(payload);
    
    if (exito) {
      alert(`Intervalo de muestreo actualizado a: ${intervaloMuestreo} minutos.`);
    } else {
      alert(`Error al guardar el intervalo en el servidor.`);
    }
    setEnviandoOrden(false);
  };

  const manejarGuardarReglas = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviandoOrden(true);

    const payload: ConfiguracionSistema = {
      modo: OrigenRiego.REGLAS,
      reglas: {
        humedadMinima: humedadMinima,
        temperaturaMaxima: temperaturaMaxima,
        duracionRiego: duracionRiego
      }
    };

    const exito = await actualizarConfiguracion(payload);
    
    if (exito) {
      alert(`Reglas guardadas correctamente en la nube.`);
    } else {
      alert(`Error al guardar las reglas.`);
    }
    setEnviandoOrden(false);
  };

  const manejarRiegoManual = async () => {
    try {
      setEnviandoOrden(true);
      await activarRiegoManual();
      alert('¡Orden enviada correctamente! La bomba se activará en breves segundos.');
    } catch (error) {
      alert('Error de comunicación con el servidor. No se pudo activar el riego.');
    } finally {
      setEnviandoOrden(false);
    }
  };

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
        
        <form onSubmit={manejarGuardarIntervalo} className="flex flex-col sm:flex-row items-end gap-4">
          <Box className={styles.inputGroup}>
            <label className={styles.label}>Intervalo de muestreo (minutos)</label>
            <input 
              type="number" 
              min="1" 
              className={styles.inputField} 
              value={intervaloMuestreo}
              onChange={(e) => setIntervaloMuestreo(parseInt(e.target.value) || 1)}
            />
          </Box>
          <button type="submit" className={styles.btnSecundario}>
            Aplicar Intervalo
          </button>
        </form>
      </Box>
      {/* ------------------------------------------------ */}


      <Typography variant="h5" className="font-bold text-emerald-900 mb-4 mt-8">
        Modo de Operación
      </Typography>

      {/* REJILLA DE TARJETAS DE SELECCIÓN */}
      <Box className={styles.gridModos}>
        <Box 
          className={modo === OrigenRiego.MANUAL ? styles.cardModoActive : styles.cardModo}
          onClick={() => setModo(OrigenRiego.MANUAL)}
        >
          <Box className={modo === OrigenRiego.MANUAL ? styles.iconWrapperActive : styles.iconWrapper}>
            <TouchAppIcon fontSize="large" />
          </Box>
          <Typography className={modo === OrigenRiego.MANUAL ? styles.modoTitleActive : styles.modoTitle}>
            Riego Manual
          </Typography>
          <Typography className={styles.modoDesc}>
            Toma el control absoluto. El agua solo se activará cuando decidas pulsar el botón.
          </Typography>
        </Box>

        <Box 
          className={modo === OrigenRiego.REGLAS ? styles.cardModoActive : styles.cardModo}
          onClick={() => setModo(OrigenRiego.REGLAS)}
        >
          <Box className={modo === OrigenRiego.REGLAS ? styles.iconWrapperActive : styles.iconWrapper}>
            <TuneIcon fontSize="large" />
          </Box>
          <Typography className={modo === OrigenRiego.REGLAS ? styles.modoTitleActive : styles.modoTitle}>
            Inteligente por Reglas
          </Typography>
          <Typography className={styles.modoDesc}>
            Define umbrales de humedad y temperatura para que el sistema riegue por ti.
          </Typography>
        </Box>

        <Box 
          className={modo === OrigenRiego.AUTOMATICO ? styles.cardModoActive : styles.cardModo}
          onClick={() => setModo(OrigenRiego.AUTOMATICO)}
        >
          <Box className={modo === OrigenRiego.AUTOMATICO ? styles.iconWrapperActive : styles.iconWrapper}>
            <PsychologyIcon fontSize="large" />
          </Box>
          <Typography className={modo === OrigenRiego.AUTOMATICO ? styles.modoTitleActive : styles.modoTitle}>
            Inteligente por IA
          </Typography>
          <Typography className={styles.modoDesc}>
            Un modelo de aprendizaje automático decide el riego basándose en el clima.
          </Typography>
        </Box>
      </Box>

      {/* PANEL DINÁMICO DE CONFIGURACIÓN DE RIEGO */}
      <Box className={styles.controlPanel}>
        
        {modo === OrigenRiego.MANUAL && (
          <Box className="text-center py-4">
            <Typography variant="h5" className={styles.panelTitle}>
              Panel de Control Manual
            </Typography>
            <Typography className={styles.panelDesc}>
              Pulsa el botón inferior para activar la bomba de agua en tiempo real.
            </Typography>
            
            <button 
              className={styles.btnManual} 
              onClick={manejarRiegoManual}
              disabled={enviandoOrden}
              style={{ opacity: enviandoOrden ? 0.7 : 1, cursor: enviandoOrden ? 'not-allowed' : 'pointer' }}
            >
              {enviandoOrden ? (
                <><CircularProgress size={20} color="inherit" /> Enviando señal...</>
              ) : (
                <><WaterIcon /> Activar Riego Ahora</>
              )}
            </button>
          </Box>
        )}

        {modo === OrigenRiego.REGLAS && (
          <Box>
            <Typography variant="h5" className={styles.panelTitle}>
              Configuración de Reglas Lógicas
            </Typography>
            <Typography className={styles.panelDesc}>
              El sistema evaluará estas tres condiciones. Si la humedad cae por debajo del mínimo, o la temperatura supera el máximo, se iniciará el riego.
            </Typography>
            
            <form onSubmit={manejarGuardarReglas} className={styles.configGrid}>
              <Box className={styles.inputGroup}>
                <label className={styles.label}>Humedad del Suelo Mínima (%)</label>
                <input 
                  type="number" 
                  min="0" 
                  max="100" 
                  className={styles.inputField} 
                  value={humedadMinima}
                  onChange={(e) => setHumedadMinima(parseInt(e.target.value) || 0)}
                />
              </Box>
              
              <Box className={styles.inputGroup}>
                <label className={styles.label}>Temperatura Máxima (°C)</label>
                <input 
                  type="number" 
                  min="0" 
                  max="50" 
                  className={styles.inputField} 
                  value={temperaturaMaxima}
                  onChange={(e) => setTemperaturaMaxima(parseInt(e.target.value) || 0)}
                />
              </Box>

              <Box className={styles.inputGroup}>
                <label className={styles.label}>Duración del Riego (segundos)</label>
                <input 
                  type="number" 
                  min="1" 
                  className={styles.inputField} 
                  value={duracionRiego}
                  onChange={(e) => setDuracionRiego(parseInt(e.target.value) || 0)}
                />
              </Box>
              
              <Box className="sm:col-span-1 flex items-end">
                <button type="submit" className={`${styles.btnGuardar} w-full`}>
                  Guardar Reglas
                </button>
              </Box>
            </form>
          </Box>
        )}

        {modo === OrigenRiego.AUTOMATICO && (
          <Box className="py-4">
            <Typography variant="h5" className={styles.panelTitle}>
              Modo Aprendizaje Automático Activo
            </Typography>
            <span className={styles.iaBadge}>Machine Learning Engine Online</span>
            <Typography className="text-gray-600 mt-4 leading-relaxed text-sm">
              En este modo, las decisiones han sido delegadas al modelo entrenado de Inteligencia Artificial.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};