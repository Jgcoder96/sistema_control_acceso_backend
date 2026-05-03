export type DayOfTheWeek =
  | 'lunes'
  | 'martes'
  | 'miercoles'
  | 'jueves'
  | 'viernes'
  | 'sabado'
  | 'domingo';

export interface ScheduleDetail {
  dia_semana?: DayOfTheWeek;
  hora_inicio: string;
  hora_fin: string;
  es_festivo: boolean;
}

export interface ScheduleInRequestBody {
  nombre: string;
  detalles: ScheduleDetail[];
}
