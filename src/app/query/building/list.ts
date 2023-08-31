import { GenericQuery } from '#query/generic'
import { BuildingEntity } from '#core/building/entity'
import { PricingService } from '#core/pricing/service'
import { LevelCostValue } from '#core/pricing/value/level'
import { TechnologyCode } from '#core/technology/constant'
import { BuildingCode } from '#core/building/constant'
import { RequirementValue } from '#core/requirement/value/requirement'
import { RequirementService } from '#core/requirement/service'

export interface ListBuildingRequest {
  city_id: string,
  player_id: string
}

export interface ListBuildingQueryResponse {
  buildings: BuildingEntity[],
  costs: Record<string, LevelCostValue>
  requirement: Record<BuildingCode, RequirementValue>
}

export class BuildingListQuery extends GenericQuery<ListBuildingRequest, ListBuildingQueryResponse> {
  async get({
    city_id, player_id
  }: ListBuildingRequest): Promise<ListBuildingQueryResponse> {
    const buildings = await this.repository.building.list({ city_id })
    const architecture = await this.repository.technology.get({
      player_id,
      code: TechnologyCode.ARCHITECTURE
    })
    const costs = buildings.reduce((acc, building) => {
      const cost = PricingService.getBuildingLevelCost({
        code: building.code,
        level: building.level + 1,
        architecture_level: architecture.level
      })

      return {
        ...acc,
        [building.id]: cost
      }
    }, {} as Record<string, LevelCostValue>)

    const requirement = RequirementService.listBuildingRequirements()

    return {
      buildings,
      costs,
      requirement
    }
  }
}
