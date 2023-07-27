import { CityRepository } from '#core/city/model'

export class CityCommands {
  private repository: CityRepository

  constructor({ repository }: {
    repository: CityRepository
  }) {
    this.repository = repository
  }
}
