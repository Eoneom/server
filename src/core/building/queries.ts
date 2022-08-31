import { BuildingCode } from './domain/constants'
import { BuildingErrors } from './domain/errors'
import { BuildingRepository } from './repository'
import { BuildingService } from './domain/service'
import { PricingQueries } from '../pricing/queries'
import { Resource } from '../shared/resource'

interface GetBuildingsResponse {
  buildings: {
    code: string
    level: number
    upgrade_time: number | null
    upgrade_costs: {
      duration: number
      resource: {
        plastic: number
        mushroom: number
      }
    }
  }[]
}

export class BuildingQueries {
  private repository: BuildingRepository
  private service: BuildingService
  private pricing_queries: PricingQueries

  public constructor({
    repository,
    service,
    pricing_queries
  }: {
    repository: BuildingRepository
    service: BuildingService
    pricing_queries: PricingQueries
  }) {
    this.repository = repository
    this.service = service
    this.pricing_queries = pricing_queries
  }

  async getBuildings({ city_id }: { city_id: string }): Promise<GetBuildingsResponse> {
    const buildings = await this.repository.find({ city_id })
    const response_buildings = buildings.map(async building => {
      const upgrade_costs = await this.pricing_queries.getNextLevelCost(building)

      return {
        code: building.code,
        level: building.level,
        upgrade_time: building.upgrade_time,
        upgrade_costs
      }
    })

    return {
      buildings: await Promise.all(response_buildings)
    }
  }

  async getEarningsBySecond({ city_id }: { city_id: string }): Promise<Resource> {
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
