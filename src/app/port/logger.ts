type LogFunction = (message: string, obj?: Record<string, unknown>) => void

export interface AppLogger {
  error: LogFunction
  warn: LogFunction
  info: LogFunction
  debug: LogFunction
  child: (args: Record<string, string>) => AppLogger
}
