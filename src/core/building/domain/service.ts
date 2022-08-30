import {
  BuildingCode,
  recycling_plant_earnings_by_level_by_seconds,
  recycling_plant_plastic_costs_by_level,
  recycling_plant_upgrade_time_in_seconds
} from './constants'

import { BuildingEntity } from './entity'
import { BuildingErrors } from './errors'

export interface LaunchUpgrade {
  building: BuildingEntity
  has_enough_resources: boolean,
  is_building_in_progress: boolean
}

export class BuildingService {
  launchUpgrade({
    building,
    has_enough_resources,
    is_building_in_progress,
  }: LaunchUpgrade): {
    building: BuildingEntity
  } {
    if (is_building_in_progress) {
      throw new Error(BuildingErrors.ALREADY_IN_PROGRESS)
    }

    if (!has_enough_resources) {
      throw new Error(BuildingErrors.NOT_ENOUGH_RESOURCES)
    }

    const upgrade_time = this.getUpgradeTimeInSeconds(building)
    return {
      building: building.launchUpgrade(upgrade_time)
    }
  }

  public getPlasticCostsForUpgrade({ code, level }: BuildingEntity): number {
    switch (code) {
      case BuildingCode.RECYCLING_PLANT:
        return recycling_plant_plastic_costs_by_level[level + 1]
    }

    throw new Error(BuildingErrors.UNKNOWN_BUILDING)
  }

  public getPlasticEarningsBySecond(recycling_plant_level: number): number {
    return recycling_plant_earnings_by_level_by_seconds[recycling_plant_level]
  }

  private getUpgradeTimeInSeconds({ code, level }: BuildingEntity): number {
    switch (code) {
      case BuildingCode.RECYCLING_PLANT:
        return recycling_plant_upgrade_time_in_seconds[level]
    }

    throw new Error(BuildingErrors.UNKNOWN_BUILDING)
  }
}
