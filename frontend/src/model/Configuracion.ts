import { OrigenRiego } from './Lecturas';

export interface ReglasRiego {
  humedadMinima: number;
  temperaturaMaxima: number;
  duracionRiego: number;
}

export interface ConfiguracionSistema {
  modo?: OrigenRiego;
  intervaloMuestreo?: number;
  reglas?: ReglasRiego;
}