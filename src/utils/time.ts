import {
  addDays,
  format,
  differenceInHours,
  getUnixTime,
  fromUnixTime,
} from 'date-fns';

export const nowUnix = (): number => getUnixTime(Date.now());

export const addDaysPiped = (days: number) => (date: Date) =>
  addDays(date, days);

export const durationInDaysUnix = (start: number, end: number): number => {
  return Math.ceil(
    differenceInHours(fromUnixTime(start), fromUnixTime(end)) / 24,
  );
};

export const formatDate = (date: Date): string => format(date, 'dd-MM-yyyy');

export const formatUnix = (
  unixTime: number,
  dateFormat = 'dd-MM-yyyy',
): string => {
  return format(fromUnixTime(unixTime), dateFormat);
};
