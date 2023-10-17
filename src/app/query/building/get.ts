import { GenericQuery } from '#query/generic'
import { BuildingEntity } from '#core/building/entity'
import { PricingService } from '#core/pricing/service'
import { LevelCostValue } from '#core/pricing/value/level'
import { TechnologyCode } from '#core/technology/constant'
import { BuildingCode } from '#core/building/constant/code'
import { RequirementValue } from '#core/requirement/value/requirement'
import { RequirementService } from '#core/requirement/service'
import { CityError } from '#core/city/error'
import { isWarehouseBuildingCode } from '#core/building/helper'
import { BuildingService } from '#core/building/service'

export interface BuildingGetQueryRequest {
  city_id: string
  building_code: BuildingCode
  player_id: string
}

export interface BuildingGetQueryResponse {
  building: BuildingEntity
  cost: LevelCostValue
  requirement: RequirementValue
  metadata: Record<string, unknown>
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

    const [
      building,
      architecture
    ] = await Promise.all([
      this.repository.building.getInCity({
        city_id,
        code: building_code
      }),
      this.repository.technology.get({
        player_id,
        code: TechnologyCode.ARCHITECTURE
      })
    ])

    const requirement = RequirementService.getBuildingRequirement({ building_code })
    const metadata = this.getMetadata({ building })
    const cost = PricingService.getBuildingLevelCost({
      code: building.code,
      level: building.level + 1,
      architecture_level: architecture.level
    })
    return {
      building,
      requirement,
      metadata,
      cost,
    }
  }

  private getMetadata({ building }: { building: BuildingEntity}): Record<string, unknown> {
    if (isWarehouseBuildingCode(building.code)) {
      const current_capacity = BuildingService.getWarehouseCapacity({
        level: building.level,
        code: building.code
      })
      const next_capacity = BuildingService.getWarehouseCapacity({
        level: building.level + 1,
        code: building.code
      })

      return {
        current_capacity,
        next_capacity
      }
    }

    return {}
  }
}
