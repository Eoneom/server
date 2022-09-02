import { TechnologyCode } from './domain/constants'
import { TechnologyErrors } from './domain/errors'
import { TechnologyRepository } from './repository'

export class TechnologyQueries {
  private repository: TechnologyRepository

  public constructor({
    repository,
  }: {
    repository: TechnologyRepository
  }) {
    this.repository = repository
  }

  async getLevel({ city_id, code }: { city_id: string, code: TechnologyCode }): Promise<number> {
    const technology = await this.repository.findOne({ city_id, code })
    if (!technology) {
      throw new Error(TechnologyErrors.NOT_FOUND)
    }

    return technology.level
  }
}
