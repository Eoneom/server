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

    return this.service.getEarningsBySecond({
      recycling_plant_level: recycling_plant.level,
      mushroom_farm_level: mushroom_farm.level
    })
  }
}
