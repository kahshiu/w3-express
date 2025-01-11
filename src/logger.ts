import pino, { LoggerOptions } from "pino";

const loggerConfig: LoggerOptions = {
    level: "trace",
    transport: { target: 'pino-pretty' },
    formatters: {
        level: (label: string) => {
            return { level: label.toUpperCase() };
        },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
}

export const logger = pino(loggerConfig);