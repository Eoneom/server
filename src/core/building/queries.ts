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

  async getEarningsBySecond({ city_id }: { city_id: string }): Promise<{
    plastic: number,
    mushroom: number
  }> {
    const [
      recycling_plant,
      mushroom_farm,
    ] = await Promise.all([
      this.repository.findOne({ code: BuildingCode.RECYCLING_PLANT, city_id }),
      this.repository.findOne({ code: BuildingCode.MUSHROOM_FARM, city_id }),
    ])
    if (!mushroom_farm || !recycling_plant) {
      throw new Error(BuildingErrors.NOT_FOUND)
    }

    const plastic = this.service.getEarningsBySecond({
      code: BuildingCode.RECYCLING_PLANT,
      level: recycling_plant.level
    })
    const mushroom = this.service.getEarningsBySecond({
      code: BuildingCode.MUSHROOM_FARM,
      level: recycling_plant.level
    })

    return {
      plastic,
      mushroom
    }
  }
}
