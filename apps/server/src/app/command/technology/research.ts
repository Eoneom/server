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
    city_cell,
    technology,
    is_technology_in_progress
  ] = await Promise.all([
    repository.city.get(city_id),
    repository.cell.getCityCell({ city_id }),
    repository.technology.get({
      player_id,
      code: technology_code
    }),
    repository.technology.isInProgress({ player_id })
  ])

  const levels = await AppService.getTechnologyRequirementLevels({
    city_id,
    player_id,
    technology_code,
    technology_level: technology.level
  })

  RequirementService.checkTechnologyRequirement({
    technology_code: technology.code,
    technology_level: technology.level,
    levels,
  })

  const research_lab = await repository.building.get({
    city_id,
    code: BuildingCode.RESEARCH_LAB
  })

  const {
    resource,
    duration
  } = PricingService.getTechnologyLevelCost({
    code: technology.code,
    level: technology.level + 1,
    research_lab_level: research_lab.level
  })
  const stock = await repository.resource_stock.getByCellId({
    cell_id: city_cell.id
  })
  AppService.assertCityResourceStockContext({ city, city_cell, stock, player_id })
  const updated_stock = stock.purchase({ resource })
  const updated_technology = technology.launchResearch({
    is_technology_in_progress,
    duration,
  })

  await Promise.all([
    repository.resource_stock.updateOne(updated_stock),
    repository.technology.updateOne(updated_technology)
  ])
}
