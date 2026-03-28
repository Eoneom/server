import { Factory } from '#adapter/factory'
import { AppService } from '#app/service'
import { BuildingCode } from '#core/building/constant/code'
import { CityError } from '#core/city/error'
import { PricingService } from '#core/pricing/service'
import { RequirementService } from '#core/requirement/service'
import { TechnologyCode } from '#core/technology/constant/code'

export interface BuildingUpgradeRequest {
  player_id: string
  city_id: string
  building_code: BuildingCode
}

export async function upgradeBuilding({
  player_id,
  city_id,
  building_code,
}: BuildingUpgradeRequest): Promise<void> {
  const repository = Factory.getRepository()
  const logger = Factory.getLogger('app:command:building:upgrade')
  logger.info('run')

  const [
    maximum_building_levels,
    total_building_levels,
  ] = await Promise.all([
    AppService.getCityMaximumBuildingLevels({ city_id }),
    repository.building.getTotalLevels({ city_id }),
  ])

  if (total_building_levels >= maximum_building_levels) {
    throw new Error(CityError.NOT_ENOUGH_SPACE)
  }

  const [
    city,
    building,
    is_building_in_progress,
    levels
  ] = await Promise.all([
    repository.city.get(city_id),
    repository.building.get({
      city_id,
      code: building_code
    }),
    repository.building.isInProgress({ city_id }),
    AppService.getBuildingRequirementLevels({
      city_id,
      player_id,
      building_code
    })
  ])

  RequirementService.checkBuildingRequirement({
    building_code: building.code,
    levels
  })

  const architecture_technology = await repository.technology.get({
    player_id,
    code: TechnologyCode.ARCHITECTURE
  })

  const {
    resource,
    duration
  } = PricingService.getBuildingLevelCost({
    level: building.level + 1,
    code: building.code,
    architecture_level: architecture_technology.level
  })
  const updated_city = city.purchase({
    player_id,
    resource
  })
  const updated_building = building.launchUpgrade({
    is_building_in_progress,
    duration,
  })

  await Promise.all([
    repository.city.updateOne(updated_city),
    repository.building.updateOne(updated_building)
  ])
}
