export const getDayId = (
  day: string | null,
  isHoliday: boolean | null,
): number => {
  if (isHoliday === true) return 0;
  const mapping: Record<string, number> = {
    lunes: 1,
    martes: 2,
    miercoles: 3,
    jueves: 4,
    viernes: 5,
    sabado: 6,
    domingo: 7,
  };
  return mapping[day?.toLowerCase() || ''] || 0;
};
