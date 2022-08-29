import { getWoodCostsForUpgrade, getWoodUpgradeTimeInSeconds } from '../../city/queries'

import { BuildingEntity } from './entity'
import { CityEntity } from '../../city/domain/entity'

export interface LaunchUpgrade {
  building: BuildingEntity
  city: CityEntity,
}

export class BuildingService {
  launchUpgrade({
    building,
    city,
  }: LaunchUpgrade): {
    building: BuildingEntity
  } {
    const wood_cost = getWoodCostsForUpgrade(building)
    if (!city.hasResources(wood_cost)) {
      throw new Error('city-not-enough-resources')
    }

    const upgrade_time = getWoodUpgradeTimeInSeconds(building.level)
    return {
      building: building.launchUpgrade(upgrade_time)
    }
  }
}
