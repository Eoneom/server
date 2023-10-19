import { TechnologyEntity } from '#core/technology/entity'
import { Factory } from '#adapter/factory'
import { LevelCostValue } from '#core/pricing/value/level'
import { PricingService } from '#core/pricing/service'
import { TechnologyCode } from '#core/technology/constant'
import { BuildingCode } from '#core/building/constant/code'
import { RequirementValue } from '#core/requirement/value/requirement'
import { RequirementService } from '#core/requirement/service'
import { GenericQuery } from '#query/generic'
import { TechnologyService } from '#core/technology/service'

interface TechnologyListRequest {
  player_id: string
  city_id: string
}

export interface TechnologyListQueryResponse {
  technologies: TechnologyEntity[]
  costs: Record<string, LevelCostValue>
  requirement: Record<TechnologyCode, RequirementValue>
}

export class TechnologyListQuery extends GenericQuery<TechnologyListRequest, TechnologyListQueryResponse> {
  async get({
    player_id,
    city_id
  }: TechnologyListRequest): Promise<TechnologyListQueryResponse> {
    const repository = Factory.getRepository()
    const technologies = await repository.technology.list({ player_id })
    const research_lab_level = await repository.building.getLevel({
      city_id,
      code: BuildingCode.RESEARCH_LAB
    })
    const costs = technologies.reduce((acc, technology) => {
      const cost = PricingService.getTechnologyLevelCost({
        code: technology.code,
        level: technology.level + 1,
        research_lab_level: research_lab_level
      })

      return {
        ...acc,
        [technology.id]: cost
      }
    }, {} as Record<string, LevelCostValue>)

    const requirement = RequirementService.listTechnologyRequirements()

    return {
      technologies: TechnologyService.sortTechnologies({ technologies }),
      costs,
      requirement
    }
  }
}
