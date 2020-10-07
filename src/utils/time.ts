import format from 'date-fns/format';
import differenceInHours from 'date-fns/differenceInHours';

export const nowUnix = (): number => Math.ceil(Date.now() / 1000);

export const toUnix = (dateOrTime: Date | number): number => {
  const time = dateOrTime instanceof Date ? dateOrTime.getTime() : dateOrTime;
  return Math.floor(time / 1e3);
};

export const fromUnix = (unixTime: number): Date => {
  return new Date(unixTime * 1e3);
};

export const durationInDaysUnix = (start: number, end: number): number => {
  return Math.ceil(differenceInHours(fromUnix(start), fromUnix(end)) / 24);
};

export const formatUnix = (
  unixTime: number,
  dateFormat = 'dd-MM-yyyy',
): string => {
  return format(fromUnix(unixTime), dateFormat);
};
