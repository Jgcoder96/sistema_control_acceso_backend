import type { HoraryDetail } from '../types/index.js';

export const validateScheduleOverlaps = (
  details: HoraryDetail[],
): string | null => {
  const groups: Record<string, HoraryDetail[]> = {};

  for (const detail of details) {
    const key = detail.es_festivo ? 'holiday' : (detail.dia_semana as string);
    if (!groups[key]) groups[key] = [];
    groups[key].push(detail);
  }

  for (const [day, daySchedule] of Object.entries(groups)) {
    const sortedSchedule = daySchedule.sort((a, b) =>
      a.hora_inicio.localeCompare(b.hora_inicio),
    );

    for (let i = 0; i < sortedSchedule.length - 1; i++) {
      const current = sortedSchedule[i];
      const next = sortedSchedule[i + 1];

      // SOLUCIÓN: Verificamos que ambos existan para que TS esté tranquilo
      if (!current || !next) continue;

      if (current.hora_fin > next.hora_inicio) {
        const dayLabel =
          day === 'holiday' ? 'los días festivos' : `el día ${day}`;
        return `Conflicto de horario en ${dayLabel}: el rango [${current.hora_inicio} - ${current.hora_fin}] se cruza con [${next.hora_inicio} - ${next.hora_fin}].`;
      }
    }
  }

  return null;
};
