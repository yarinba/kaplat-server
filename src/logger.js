import winston from "winston";
import { globalRequestCounter } from "./app";

const logggerBaseConfig = {
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "DD-MM-YYYY HH:mm:ss.sss" }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level.toUpperCase()}: ${message} | request #${globalRequestCounter}`;
    })
  ),
};

export const requestLogger = winston.createLogger({
  ...logggerBaseConfig,
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/requests.log" }),
  ],
});

export const todoLogger = winston.createLogger({
  ...logggerBaseConfig,
  transports: [new winston.transports.File({ filename: "logs/todos.log" })],
});
