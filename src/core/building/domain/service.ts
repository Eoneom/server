import {
  BuildingCode,
  building_earnings,
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
    is_building_in_progress,
    duration
  }: {
    building: BuildingEntity
    is_building_in_progress: boolean
    duration: number
  }): {
    building: BuildingEntity
  } {
    if (is_building_in_progress) {
      throw new Error(BuildingErrors.ALREADY_IN_PROGRESS)
    }

    return {
      building: building.launchUpgrade(duration)
    }
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
}
