import { BuildingCode } from './constants'
import { BuildingErrors } from './errors'
import { BuildingRepository } from './repository'

export class BuildingQueries {
  private repository: BuildingRepository

  public constructor(repository: BuildingRepository) {
    this.repository = repository
  }

  public async getLevel(query: { code: BuildingCode, city_id: string }): Promise<number> {
    const level = await this.repository.level(query)
    if (!level) {
      throw new Error(BuildingErrors.NOT_FOUND)
    }

    return level
  }
}
