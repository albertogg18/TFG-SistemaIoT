export enum OrigenRiego {
  AUTOMATICO = 'automatico',
  MANUAL = 'manual',
  REGLAS = 'reglas',
}

export interface Sensores {
  temperatura: number,
  humedad_aire: number,
  humedad_suelo: number,
  luminosidad: number,
}

export interface Lectura {
  id: string,
  timestamp: string,
  dispositivo_id: string,
  sensores: Sensores,
  evento_riego: boolean,
  origen_riego?: OrigenRiego,
}