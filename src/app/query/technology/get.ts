import { GenericQuery } from '#query/generic'
import { PricingService } from '#core/pricing/service'
import { LevelCostValue } from '#core/pricing/value/level'
import { TechnologyCode } from '#core/technology/constant/code'
import { BuildingCode } from '#core/building/constant/code'
import { RequirementValue } from '#core/requirement/value/requirement'
import { RequirementService } from '#core/requirement/service'
import { Factory } from '#adapter/factory'
import { TechnologyEntity } from '#core/technology/entity'

export interface TechnologyGetQueryRequest {
  city_id: string
  technology_code: TechnologyCode
  player_id: string
}

export interface TechnologyGetQueryResponse {
  technology: TechnologyEntity
  cost: LevelCostValue
  requirement: RequirementValue
}

export class TechnologyGetQuery extends GenericQuery<TechnologyGetQueryRequest, TechnologyGetQueryResponse> {
  constructor() {
    super({ name: 'technology:get' })
  }

  protected async get({
    technology_code,
    city_id,
    player_id
  }: TechnologyGetQueryRequest): Promise<TechnologyGetQueryResponse> {
    const repository = Factory.getRepository()
    const technology = await repository.technology.get({
      player_id,
      code: technology_code
    })
    const research_lab_level = await repository.building.getLevel({
      city_id,
      code: BuildingCode.RESEARCH_LAB
    })
    const cost = PricingService.getTechnologyLevelCost({
      code: technology.code,
      level: technology.level + 1,
      research_lab_level: research_lab_level
    })
    const requirement = RequirementService.getTechnologyRequirement({ technology_code })

    return {
      technology,
      cost,
      requirement
    }
  }
}
