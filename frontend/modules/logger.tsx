export enum LogLevel {
  info = 0,
  warning,
  error,
  debug,
  all
}

export class Logger {
  level: LogLevel;

  constructor(level: LogLevel) {
    this.level = level;
  }

  info(...pars: any[]) {
    if (this.level >= LogLevel.info) {
      console.log(LogLevel.info, ...pars);
    }
  }

  warning(...pars: any[]) {
    if (this.level >= LogLevel.warning) {
      console.warn(...pars);
    }
  }

  error(...pars: any[]) {
    if (this.level >= LogLevel.error) {
      console.error(...pars);
    }
  }

  debug(...pars: any[]) {
    if (this.level >= LogLevel.debug) {
      console.log(...pars);
    }
  }
}

export default Logger;
