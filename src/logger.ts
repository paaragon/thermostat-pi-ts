import winston = require("winston");
import DailyRotateFile = require("winston-daily-rotate-file");
import fs = require("fs");
import path = require("path");

export class Logger {
  private logger: winston.Logger;
  private filename: string;

  constructor(name: string) {
    const logDir = "log";
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir);
    }
    const filename = path.join(logDir, `${name}.log`);
    this.logger = winston.createLogger({
      level: "debug",
      format: winston.format.combine(
        winston.format.timestamp({
          format: "YYYY-MM-DD HH:mm:ss"
        }),
        winston.format.printf(
          info => `${info.timestamp} ${info.level}: ${info.message}`
        )
      ),
      transports: [
        new winston.transports.Console({
          level: "info",
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(
              info => `${info.timestamp} ${info.level}: ${info.message}`
            )
          )
        }),
        new winston.transports.File({ filename }),
        new DailyRotateFile({
          filename: `${logDir}/%DATE%.log`,
          datePattern: "YYYY-MM-DD"
        })
      ]
    });
  }

  public info(msg) {
    this.logger.info(msg);
  }

  public warn(msg) {
    this.logger.info(msg);
  }

  public error(msg) {
    this.logger.info(msg);
  }
}
