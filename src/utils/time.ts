export const nowUnix = (): number => Math.ceil(Date.now() / 1000);

export const toUnix = (dateOrTime: Date | number): number => {
  const time = dateOrTime instanceof Date ? dateOrTime.getTime() : dateOrTime;
  return Math.floor(time / 1e3);
};

export const fromUnix = (unixTime: number): Date => {
  return new Date(unixTime * 1e3);
};
