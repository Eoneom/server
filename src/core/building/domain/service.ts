import {
  BuildingCode,
  building_costs,
  building_earnings,
  building_upgrade_durations_in_second,
} from './constants'

import { BuildingEntity } from './entity'
import { BuildingErrors } from './errors'

export class BuildingService {
  initBuildings({
    has_building_in_city,
    city_id
  }: {
    has_building_in_city: boolean,
    city_id: string
  }): BuildingEntity[] {
    if (has_building_in_city) {
      throw new Error(BuildingErrors.ALREADY_EXISTS)
    }

    const recycling_plant = BuildingEntity.initRecyclingPlant({ city_id })
    const mushroom_farm = BuildingEntity.initMushroomFarm({ city_id })
    const research_lab = BuildingEntity.initResearchLab({ city_id })

    return [
      recycling_plant,
      mushroom_farm,
      research_lab
    ]
  }

  launchUpgrade({
    building,
    has_enough_resources,
    is_building_in_progress,
  }: {
    building: BuildingEntity
    has_enough_resources: boolean
    is_building_in_progress: boolean
  }): {
    building: BuildingEntity
  } {
    if (is_building_in_progress) {
      throw new Error(BuildingErrors.ALREADY_IN_PROGRESS)
    }

    if (!has_enough_resources) {
      throw new Error(BuildingErrors.NOT_ENOUGH_RESOURCES)
    }

    const upgrade_duration = this.getUpgradeDurationInSeconds(building)
    return {
      building: building.launchUpgrade(upgrade_duration)
    }
  }

  getCostsForUpgrade({ code, level }: BuildingEntity): { plastic: number, mushroom: number } {
    const costs = building_costs[code]
    if (!costs) {
      throw new Error(BuildingErrors.UNKNOWN_BUILDING)
    }
    const upgraded_level = level + 1
    const level_costs = costs[upgraded_level]
    if (!level_costs) {
      throw new Error(BuildingErrors.UNKNOWN_COSTS_LEVEL)
    }

    return level_costs
  }

  getEarningsBySecond({
    recycling_plant_level,
    mushroom_farm_level
  }: {
    recycling_plant_level: number,
    mushroom_farm_level: number,
  }): {
    plastic: number,
    mushroom: number
  } {
    return {
      plastic: building_earnings[BuildingCode.RECYCLING_PLANT][recycling_plant_level],
      mushroom: building_earnings[BuildingCode.MUSHROOM_FARM][mushroom_farm_level]
    }
  }

  private getUpgradeDurationInSeconds({ code, level }: BuildingEntity): number {
    const upgrade_durations = building_upgrade_durations_in_second[code]
    if (!upgrade_durations) {
      throw new Error(BuildingErrors.UNKNOWN_BUILDING)
    }

    const upgraded_level = level + 1
    const upgrade_duration = upgrade_durations[upgraded_level]
    if (!upgrade_duration) {
      throw new Error(BuildingErrors.UNKNOWN_UPGRADE_DURATION_LEVEL)
    }

    return upgrade_duration
  }
}
