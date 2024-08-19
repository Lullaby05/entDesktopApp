export enum timeUnitsType {
  seconds = 'seconds',
  minutes = 'minutes',
  hours = 'hours',
  days = 'days',
}
type optionsType = {
  now?: number | Date | string;
  time: string;
  status?: boolean;
  leastUnit?: timeUnitsType;
  maxUnit?: timeUnitsType;
  returnType?: 'string' | 'object';
  padZero?: boolean;
};
type returnType =
  | string
  | { days: string; hours: string; minutes: string; seconds: string };
export function calculateTime(
  options: optionsType & { returnType?: 'string' }
): string;
export function calculateTime(
  options: optionsType & { returnType?: 'object' }
): {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

export function calculateTime(options: optionsType): returnType {
  const defaultOptions = {
    now: new Date(),
    time: '',
    status: false,
    leastUnit: timeUnitsType.seconds,
    maxUnit: timeUnitsType.days,
    returnType: 'string',
    padZero: true,
  };
  const { now, time, status, leastUnit, maxUnit, returnType, padZero } = {
    ...defaultOptions,
    ...options,
  };
  if (!timeUnitsType[leastUnit] || !timeUnitsType[maxUnit])
    throw new Error('Invalid time unit type');
  if (status || !time) return time;

  const timeObj = {
    [timeUnitsType.seconds]: 1,
    [timeUnitsType.minutes]: 2,
    [timeUnitsType.hours]: 3,
    [timeUnitsType.days]: 4,
  };
  const timeUnitCN = {
    [timeUnitsType.seconds]: '秒',
    [timeUnitsType.minutes]: '分钟',
    [timeUnitsType.hours]: '小时',
    [timeUnitsType.days]: '天',
  };
  const diffInSeconds = Math.floor((+new Date(now) - +new Date(time)) / 1000);
  const days = Math.floor(diffInSeconds / (24 * 60 * 60));
  const hours = Math.floor((diffInSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((diffInSeconds % (60 * 60)) / 60);
  const seconds = diffInSeconds % 60;

  if (returnType === 'object')
    return {
      days: days.toString(),
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
    };

  let result = '';
  for (let i = timeObj[maxUnit]; i >= timeObj[leastUnit]; i--) {
    if (i === timeObj[timeUnitsType.days]) {
      result += days ? `${days}${timeUnitCN[timeUnitsType.days]}` : '';
    } else if (i === timeObj[timeUnitsType.hours]) {
      result += hours
        ? `${padZero ? hours.toString().padStart(2, '0') : hours}${
            timeUnitCN[timeUnitsType.hours]
          }`
        : '';
    } else if (i === timeObj[timeUnitsType.minutes]) {
      result += minutes
        ? `${padZero ? minutes.toString().padStart(2, '0') : minutes}${
            timeUnitCN[timeUnitsType.minutes]
          }`
        : '';
    } else if (i === timeObj[timeUnitsType.seconds]) {
      result += seconds
        ? `${padZero ? seconds.toString().padStart(2, '0') : seconds}${
            timeUnitCN[timeUnitsType.seconds]
          }`
        : '';
    }
    if (i === timeObj[leastUnit] && result === '') {
      result += '1' + timeUnitCN[leastUnit];
    }
  }
  return result + '前';
}
