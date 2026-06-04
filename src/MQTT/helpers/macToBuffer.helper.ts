export const macToBuffer = (mac: string): Buffer => {
  const parts = mac.split(':').map((part) => parseInt(part, 16));
  return Buffer.from(parts);
};
