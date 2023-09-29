
//FORMAT HH:mm:ss
export const getTime = (time?: string): number => {
  if (!time) {
    return NaN;
  }
  return Number(time.split(":")?.[0]) > 0
    ? Number(time.split(":")?.[0])
    : Number(time.split(":")?.[0]) + 24;
};
