import { MongoRepository } from '#adapter/repository/mongo'
import { Repository } from '#app/port/repository/generic'
import { AppLogger } from '#app/port/logger'
import { loggerAdapter } from '#adapter/logger'
import { Lock } from '#app/port/lock'
import { LockInMemory } from '#adapter/lock'

export class Factory {
  private static repository: Repository
  private static lock: Lock

  static getRepository(): Repository {
    if (!this.repository) {
      this.repository = new MongoRepository()
    }

    return this.repository
  }

  static getLogger(component: string): AppLogger {
    return loggerAdapter().child({ component })
  }

  static getLock(): Lock {
    if (!this.lock) {
      this.lock = new LockInMemory({ logger: this.getLogger('lock') })
    }

    return this.lock
  }
}
