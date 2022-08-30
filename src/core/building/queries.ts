import { BuildingCode } from './domain/constants'
import { BuildingErrors } from './domain/errors'
import { BuildingRepository } from './repository'
import { BuildingService } from './domain/service'

interface GetBuildingsResponse {
  buildings: {
    code: string
    level: number
    upgrade_time: number | null
    upgrade_costs: {
      plastic: number
      mushroom: number
    }
  }[]
}

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

  async getBuildings({ city_id }: { city_id: string }): Promise<GetBuildingsResponse> {
    const buildings = await this.repository.find({ city_id })
    const response_buildings = buildings.map(building => {
      let upgrade_costs = {
        plastic: 0,
        mushroom: 0
      }

      try {
        upgrade_costs = this.service.getCostsForUpgrade(building)
      } catch (err) { }

      return {
        code: building.code,
        level: building.level,
        upgrade_time: building.upgrade_time,
        upgrade_costs
      }
    })

    return {
      buildings: response_buildings
    }
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

  async getResearchLevel({ city_id }: { city_id: string }): Promise<number> {
    const research_lab = await this.repository.findOne({ city_id, code: BuildingCode.RESEARCH_LAB })
    if (!research_lab) {
      throw new Error(BuildingErrors.NOT_FOUND)
    }

    return research_lab.level
  }
}
