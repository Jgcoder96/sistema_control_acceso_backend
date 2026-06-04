export const getHMSTuple = (date: Date) => ({
  h: date.getUTCHours(),
  m: date.getUTCMinutes(),
  s: date.getUTCSeconds(),
});
