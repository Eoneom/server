import { BuildingCode } from './domain/constants'
import { BuildingErrors } from './domain/errors'
import { Repository } from '../shared/repository'

export class BuildingQueries {
  private repository: Repository

  public constructor(repository: Repository) {
    this.repository = repository
  }

  public async getLevel(query: { code: BuildingCode, city_id: string }): Promise<number> {
    const building = await this.repository.building.findOne(query)
    if (!building) {
      throw new Error(BuildingErrors.NOT_FOUND)
    }

    return building.level
  }
}
