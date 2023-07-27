import { MongoRepository } from '#database/repository'
import { Repository } from '#shared/repository'

export class Factory {
  private static repository: Repository

  static getRepository(): Repository {
    if (!this.repository) {
      this.repository = new MongoRepository()
    }

    return this.repository
  }
}
