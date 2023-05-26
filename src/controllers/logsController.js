import { todoLogger, requestLogger } from "../logger";

const loggers = {
  "request-logger": requestLogger,
  "todo-logger": todoLogger,
};

export const getCurrentLevel = async (req, reply) => {
  try {
    const loggerName = req.query["logger-name"];

    const level = loggers[loggerName].level.toUpperCase();

    return reply.send(`Success: ${level}`);
  } catch (error) {
    return reply.send(`Failure: ${error.message}`);
  }
};

export const setLevel = async (req, reply) => {
  try {
    const loggerName = req.query["logger-name"];
    const loggerLevel = req.query["logger-level"];

    loggers[loggerName].level = loggerLevel.toLowerCase();

    return reply.send(`Success: ${loggerLevel.toUpperCase()}`);
  } catch (error) {
    return reply.send(`Failure: ${error.message}`);
  }
};
