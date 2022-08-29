import { BuildingCode } from './constants'
import { BuildingErrors } from './errors'
import { Repository } from '../shared/repository'

export class BuildingQueries {
  private repository: Repository

  public constructor(repository: Repository) {
    this.repository = repository
  }

  public async getLevel(query: { code: BuildingCode, city_id: string }): Promise<number> {
    const level = await this.repository.building.level(query)
    if (!level) {
      throw new Error(BuildingErrors.NOT_FOUND)
    }

    return level
  }
}
