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

  public async getLevel(query: { code: BuildingCode, city_id: string }): Promise<number> {
    const building = await this.repository.findOne(query)
    if (!building) {
      throw new Error(BuildingErrors.NOT_FOUND)
    }

    return building.level
  }

  public async getCityWoodEarningsBySecond(query: { city_id: string }): Promise<number> {
    const wood_camp = await this.repository.findOne({ code: BuildingCode.WOOD_CAMP, city_id: query.city_id })
    if (!wood_camp) {
      throw new Error(BuildingErrors.NOT_FOUND)
    }

    return this.service.getWoodEarningsBySecond(wood_camp.level)
  }
}
