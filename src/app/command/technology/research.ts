import { Factory } from '#adapter/factory'
import { AppService } from '#app/service'
import { BuildingCode } from '#core/building/constant/code'
import { PricingService } from '#core/pricing/service'
import { RequirementService } from '#core/requirement/service'
import { TechnologyCode } from '#core/technology/constant/code'

export interface ResearchTechnologyParams {
  player_id: string
  city_id: string
  technology_code: TechnologyCode
}

export async function researchTechnology({
  city_id,
  player_id,
  technology_code,
}: ResearchTechnologyParams): Promise<void> {
  const repository = Factory.getRepository()
  const logger = Factory.getLogger('app:command:technology:research')
  logger.info('run')

  const [
    city,
    technology,
    is_technology_in_progress,
    research_lab,
    levels
  ] = await Promise.all([
    repository.city.get(city_id),
    repository.technology.get({
      player_id,
      code: technology_code
    }),
    repository.technology.isInProgress({ player_id }),
    repository.building.get({
      city_id,
      code: BuildingCode.RESEARCH_LAB
    }),
    AppService.getTechnologyRequirementLevels({
      city_id,
      player_id,
      technology_code
    })
  ])

  RequirementService.checkTechnologyRequirement({
    technology_code: technology.code,
    levels,
  })
  const {
    resource,
    duration
  } = PricingService.getTechnologyLevelCost({
    code: technology.code,
    level: technology.level + 1,
    research_lab_level: research_lab.level
  })
  const updated_city = city.purchase({
    player_id,
    resource
  })
  const updated_technology = technology.launchResearch({
    is_technology_in_progress,
    duration,
  })

  await Promise.all([
    repository.city.updateOne(updated_city),
    repository.technology.updateOne(updated_technology)
  ])
}
