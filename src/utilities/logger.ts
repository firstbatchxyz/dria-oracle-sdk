import Pino from "pino";
import config from "../configurations";

/** A generic Pino logger. */
export const logger = Pino({
  level: config.LOG_LEVEL,
  name: "oracle-twitter",
  transport: ["development", "test"].includes(config.NODE_ENV)
    ? {
        target: "pino-pretty",
        options: {
          // ignore process id
          ignore: "pid,hostname",
        },
      }
    : undefined,
});
