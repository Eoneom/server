import { Factory } from '#adapter/factory'
import { AppService } from '#app/service'
import { BuildingCode } from '#core/building/constant/code'
import { BuildingEntity } from '#core/building/entity'
import { CityEntity } from '#core/city/entity'
import { CityError } from '#core/city/error'
import { PricingService } from '#core/pricing/service'
import {
  Levels,
  RequirementService
} from '#core/requirement/service'
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
    architecture_technology,
    city,
    building,
    is_building_in_progress,
    maximum_building_levels,
    total_building_levels,
    levels
  ] = await Promise.all([
    repository.technology.get({
      player_id,
      code: TechnologyCode.ARCHITECTURE
    }),
    repository.city.get(city_id),
    repository.building.get({
      city_id,
      code: building_code
    }),
    repository.building.isInProgress({ city_id }),
    AppService.getCityMaximumBuildingLevels({ city_id }),
    repository.building.getTotalLevels({ city_id }),
    AppService.getBuildingRequirementLevels({
      city_id,
      player_id,
      building_code
    })
  ])

  if (total_building_levels >= maximum_building_levels) {
    throw new Error(CityError.NOT_ENOUGH_SPACE)
  }
  RequirementService.checkBuildingRequirement({
    building_code: building.code,
    levels
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
