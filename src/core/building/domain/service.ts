import {
  BuildingCode,
  mushroom_farm_earnings_by_level_by_seconds,
  mushroom_farm_mushroom_costs_by_level,
  mushroom_farm_plastic_costs_by_level,
  mushroom_farm_upgrade_time_in_seconds,
  recycling_plant_earnings_by_level_by_seconds,
  recycling_plant_mushroom_costs_by_level,
  recycling_plant_plastic_costs_by_level,
  recycling_plant_upgrade_time_in_seconds
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
  }): {
    buildings: BuildingEntity[]
  } {
    if (has_building_in_city) {
      throw new Error(BuildingErrors.ALREADY_EXISTS)
    }

    const recycling_plant = BuildingEntity.initRecyclingPlant({ city_id })
    const mushroom_farm = BuildingEntity.initMushroomFarm({ city_id })

    return {
      buildings: [
        recycling_plant,
        mushroom_farm
      ]
    }
  }

  launchUpgrade({
    building,
    is_building_in_progress,
  }: {
    building: BuildingEntity
    is_building_in_progress: boolean
  }): {
    building: BuildingEntity
  } {
    if (is_building_in_progress) {
      throw new Error(BuildingErrors.ALREADY_IN_PROGRESS)
    }

    const upgrade_time = this.getUpgradeTimeInSeconds(building)
    return {
      building: building.launchUpgrade(upgrade_time)
    }
  }

  getCostsForUpgrade({ code, level }: BuildingEntity): { plastic: number, mushroom: number } {
    const upgraded_level = level + 1
    switch (code) {
      case BuildingCode.RECYCLING_PLANT:
        return {
          plastic: recycling_plant_plastic_costs_by_level[upgraded_level],
          mushroom: recycling_plant_mushroom_costs_by_level[upgraded_level]
        }
      case BuildingCode.MUSHROOM_FARM:
        return {
          plastic: mushroom_farm_plastic_costs_by_level[upgraded_level],
          mushroom: mushroom_farm_mushroom_costs_by_level[upgraded_level]
        }
    }

    throw new Error(BuildingErrors.UNKNOWN_BUILDING)
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
      plastic: recycling_plant_earnings_by_level_by_seconds[recycling_plant_level],
      mushroom: mushroom_farm_earnings_by_level_by_seconds[mushroom_farm_level]
    }
  }

  private getUpgradeTimeInSeconds({ code, level }: BuildingEntity): number {
    const upgraded_level = level + 1
    switch (code) {
      case BuildingCode.RECYCLING_PLANT:
        return recycling_plant_upgrade_time_in_seconds[upgraded_level]
      case BuildingCode.MUSHROOM_FARM:
        return mushroom_farm_upgrade_time_in_seconds[upgraded_level]
    }

    throw new Error(BuildingErrors.UNKNOWN_BUILDING)
  }
}
