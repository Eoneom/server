import { Lock } from '#app/port/lock'
import { AppLogger } from '#app/port/logger'

export class LockInMemory implements Lock {
  private cache: Set<string>
  private logger: AppLogger

  constructor({ logger }: { logger: AppLogger }) {
    this.logger = logger
    this.cache = new Set<string>()
  }

  has(key: string): boolean {
    const has_key = this.cache.has(key)
    this.logger.debug(`has ${key}: ${has_key}`)
    return has_key
  }

  set(key: string): void {
    this.logger.debug(`set ${key}`)
    this.cache.add(key)
  }

  delete(key: string): void {
    this.logger.debug(`delete ${key}`)
    this.cache.delete(key)
  }
}
