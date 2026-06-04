export const prepareTimeToPrisma = (timeString: string): Date => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date(Date.UTC(1970, 0, 1, hours, minutes, 0));
  return date;
};
