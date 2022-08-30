import { BuildingCode } from './domain/constants'
import { BuildingErrors } from './domain/errors'
import { BuildingRepository } from './repository'
import { BuildingService } from './domain/service'

export class BuildingQueries {
  private repository: BuildingRepository
  private service: BuildingService

  public constructor({
    repository,
    service
  }: {
    repository: BuildingRepository,
    service: BuildingService
  }) {
    this.repository = repository
    this.service = service
  }

  async getLevel(query: { code: BuildingCode, city_id: string }): Promise<number> {
    const building = await this.repository.findOne(query)
    if (!building) {
      throw new Error(BuildingErrors.NOT_FOUND)
    }

    return building.level
  }

  async getPlasticEarningsBySecond(query: { city_id: string }): Promise<number> {
    const recycling_plant = await this.repository.findOne({ code: BuildingCode.RECYCLING_PLANT, city_id: query.city_id })
    if (!recycling_plant) {
      throw new Error(BuildingErrors.NOT_FOUND)
    }

    return this.service.getPlasticEarningsBySecond(recycling_plant.level)
  }

  async getMushroomEarningsBySecond(query: { city_id: string }): Promise<number> {
    const mushroom_farm = await this.repository.findOne({ code: BuildingCode.MUSHROOM_FARM, city_id: query.city_id })
    if (!mushroom_farm) {
      throw new Error(BuildingErrors.NOT_FOUND)
    }

    return this.service.getMushroomEarningsBySecond(mushroom_farm.level)
  }
}
