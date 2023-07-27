import {
  BuildingCode, building_earnings
} from '#core/building/constants'
import { BuildingEntity } from '#core/building/entity'
import { BuildingErrors } from '#core/building/errors'

export class BuildingService {
  static init({ city_id }: { city_id: string }): BuildingEntity[] {
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
    is_building_in_progress,
    duration,
    architecture_level,
    building
  }: {
    architecture_level: number
    building: BuildingEntity
    duration: number
    is_building_in_progress: boolean
  }) {
    if (is_building_in_progress) {
      throw new Error(BuildingErrors.ALREADY_IN_PROGRESS)
    }

    const architecture_bonus = architecture_level / 100
    const reduced_duration = Math.ceil(duration * (1 - architecture_bonus))

    return building.launchUpgrade(reduced_duration)
  }

  static getEarningsBySecond({
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
