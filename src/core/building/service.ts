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
    building
  }: {
    building: BuildingEntity
    duration: number
    is_building_in_progress: boolean
  }) {
    if (is_building_in_progress) {
      throw new Error(BuildingErrors.ALREADY_IN_PROGRESS)
    }

    return building.launchUpgrade(duration)
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
    const plastic_earnings = building_earnings[BuildingCode.RECYCLING_PLANT]
    const mushroom_earnings = building_earnings[BuildingCode.MUSHROOM_FARM]
    const plastic = recycling_plant_level > 0 ?
      Math.round(Math.pow(plastic_earnings.multiplier, recycling_plant_level - 1)*plastic_earnings.base*100)/100:
      0
    const mushroom = mushroom_farm_level > 0 ?
      Math.round(Math.pow(mushroom_earnings.multiplier, mushroom_farm_level - 1)*mushroom_earnings.base*100)/100 :
      0
    return {
      plastic,
      mushroom
    }
  }
}
