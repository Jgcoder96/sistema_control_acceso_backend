export const prepareTimeToPrisma = (timeString: string): Date => {
  const formattedTime =
    timeString.length === 5 ? `${timeString}:00` : timeString;
  return new Date(`1970-01-01T${formattedTime}Z`);
};
