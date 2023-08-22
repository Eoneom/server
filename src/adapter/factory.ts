import { MongoRepository } from '#adapter/repository/mongo'
import { Repository } from '#app/port/repository/generic'
import { AppLogger } from '#app/port/logger'
import { loggerAdapter } from '#adapter/logger'

export class Factory {
  private static repository: Repository

  static getRepository(): Repository {
    if (!this.repository) {
      this.repository = new MongoRepository()
    }

    return this.repository
  }

  static getLogger(component: string): AppLogger {
    return loggerAdapter().child({ component })
  }
}
