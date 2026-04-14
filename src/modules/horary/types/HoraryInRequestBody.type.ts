export type DayOfTheWeek =
  | 'lunes'
  | 'martes'
  | 'miercoles'
  | 'jueves'
  | 'viernes'
  | 'sabado'
  | 'domingo';

export interface HoraryDetail {
  dia_semana?: DayOfTheWeek;
  hora_inicio: string;
  hora_fin: string;
  es_festivo: boolean;
}

export interface HoraryInRequestBody {
  nombre: string;
  detalles: HoraryDetail[];
}
