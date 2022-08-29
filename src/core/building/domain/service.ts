import { BuildingCode, wood_camp_costs_by_level, wood_camp_earnings_by_level_by_seconds, wood_camp_upgrade_time_in_seconds } from './constants'

import { BuildingEntity } from './entity'
import { BuildingErrors } from './errors'
import { CityEntity } from '../../city/domain/entity'

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

    const upgrade_time = this.getWoodUpgradeTimeInSeconds(building.level)
    return {
      building: building.launchUpgrade(upgrade_time)
    }
  }

  public getWoodCostsForUpgrade({ code, level }: BuildingEntity): number {
    switch (code) {
      case BuildingCode.WOOD_CAMP:
        return wood_camp_costs_by_level[level + 1]
    }

    throw new Error(BuildingErrors.UNKNOWN_BUILDING)
  }

  public getWoodUpgradeTimeInSeconds(level: number): number {
    return wood_camp_upgrade_time_in_seconds[level + 1]
  }

  public getWoodEarningsBySecond(woodcamp_level: number): number {
    return wood_camp_earnings_by_level_by_seconds[woodcamp_level]
  }
}
