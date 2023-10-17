import { GenericQuery } from '#query/generic'
import { BuildingEntity } from '#core/building/entity'
import { PricingService } from '#core/pricing/service'
import { LevelCostValue } from '#core/pricing/value/level'
import { TechnologyCode } from '#core/technology/constant'
import { BuildingCode } from '#core/building/constant/code'
import { RequirementValue } from '#core/requirement/value/requirement'
import { RequirementService } from '#core/requirement/service'
import { CityError } from '#core/city/error'

export interface BuildingGetQueryRequest {
  city_id: string
  building_code: BuildingCode
  player_id: string
}

export interface BuildingGetQueryResponse {
  building: BuildingEntity
  cost: LevelCostValue
  requirement: RequirementValue
}

export class BuildingGetQuery extends GenericQuery<BuildingGetQueryRequest, BuildingGetQueryResponse> {
  async get({
    building_code,
    city_id,
    player_id
  }: BuildingGetQueryRequest): Promise<BuildingGetQueryResponse> {
    const city = await this.repository.city.get(city_id)
    if (!city.isOwnedBy(player_id)) {
      throw new Error(CityError.NOT_OWNER)
    }
    const building = await this.repository.building.getInCity({
      city_id,
      code: building_code
    })
    const architecture = await this.repository.technology.get({
      player_id,
      code: TechnologyCode.ARCHITECTURE
    })

    const cost = PricingService.getBuildingLevelCost({
      code: building.code,
      level: building.level + 1,
      architecture_level: architecture.level
    })

    const requirement = RequirementService.getBuildingRequirement({ building_code })

    return {
      building,
      cost,
      requirement
    }
  }
}
