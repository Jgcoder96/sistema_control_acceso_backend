export const getDayId = (
  dia: string | null,
  esFestivo: boolean | null,
): number => {
  if (esFestivo === true) return 0;
  const mapping: Record<string, number> = {
    lunes: 1,
    martes: 2,
    miercoles: 3,
    jueves: 4,
    viernes: 5,
    sabado: 6,
    domingo: 7,
  };
  return mapping[dia?.toLowerCase() || ''] || 0;
};
