import winston from 'winston';
import fs from 'fs-extra';
import { LOG_LEVEL } from '../config/config';

fs.ensureDirSync('logs');

// Create a custom logger
export function createLogger(module: string) {
  return winston.createLogger({
    level: LOG_LEVEL,
    format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.printf(({ timestamp, level, message }) => {
        return `[${timestamp}] [${level.toUpperCase()}] [${module}]: ${message}`;
      })
    ),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'logs/test.log' })
    ]
  });
}