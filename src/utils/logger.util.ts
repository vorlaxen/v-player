export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

let CURRENT_LEVEL = LogLevel.DEBUG

export const setLogLevel = (level: LogLevel) => {
  CURRENT_LEVEL = level;
}

const levelPriority: Record<LogLevel, number> = {
  [LogLevel.DEBUG]: 0,
  [LogLevel.INFO]: 1,
  [LogLevel.WARN]: 2,
  [LogLevel.ERROR]: 3,
}

export const log = (
  level: LogLevel,
  name: string,
  message: any,
  ...optional: any[]
) => {
  if (levelPriority[level] < levelPriority[CURRENT_LEVEL]) return;

  const time = new Date().toISOString();
  const prefix = `[${time}] [${name}] [${level}]`;

  switch (level) {
    case LogLevel.DEBUG:
      console.debug(prefix, message, ...optional);
      break;
    case LogLevel.INFO:
      console.info(prefix, message, ...optional);
      break;
    case LogLevel.WARN:
      console.warn(prefix, message, ...optional);
      break;
    case LogLevel.ERROR:
      console.error(prefix, message, ...optional);
      break;
    default:
      console.log(prefix, message, ...optional);
  }
};

export const logger = {
  debug: (name: string, msg: any, ...opt: any[]) => log(LogLevel.DEBUG, name, msg, ...opt),
  info: (name: string, msg: any, ...opt: any[]) => log(LogLevel.INFO, name, msg, ...opt),
  warn: (name: string, msg: any, ...opt: any[]) => log(LogLevel.WARN, name, msg, ...opt),
  error: (name: string, msg: any, ...opt: any[]) => log(LogLevel.ERROR, name, msg, ...opt),
};