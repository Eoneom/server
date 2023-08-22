import { AppLogger } from '#app/port/logger'
import pino, { Logger } from 'pino'

export const loggerAdapter = (pino_logger?: Logger): AppLogger => {
  const logger = pino_logger ?? default_logger()

  return {
    error: (message: string, obj?: Record<string, unknown>): void => {
      logger.error(obj, message)
    },
    warn: (message: string, obj?: Record<string, unknown>): void => {
      logger.warn(obj, message)
    },
    info: (message: string, obj?: Record<string, unknown>): void => {
      logger.info(obj, message)
    },
    debug: (message: string, obj?: Record<string, unknown>): void => {
      logger.debug(obj, message)
    },
    child: (args: Record<string, string>): AppLogger => {
      return loggerAdapter(logger.child(args))
    }
  }
}

const default_logger = () => {
  return pino({ level: 'debug' })
}
