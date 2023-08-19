import {
  BuildingCode, building_earnings
} from '#core/building/constant'
import { BuildingEntity } from '#core/building/entity'
import { BuildingError } from '#core/building/error'
import { Resource } from '#shared/resource'

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

  static launchUpgrade({
    is_building_in_progress,
    duration,
    building
  }: {
    building: BuildingEntity
    duration: number
    is_building_in_progress: boolean
  }) {
    if (is_building_in_progress) {
      throw new Error(BuildingError.ALREADY_IN_PROGRESS)
    }

    return building.launchUpgrade(duration)
  }

  static getEarningsBySecond({
    recycling_plant_level,
    plastic_coefficient,
    mushroom_farm_level,
    mushroom_coefficient
  }: {
    recycling_plant_level: number
    plastic_coefficient: number
    mushroom_farm_level: number
    mushroom_coefficient: number
  }): Resource {
    const plastic_earnings = building_earnings[BuildingCode.RECYCLING_PLANT]
    const mushroom_earnings = building_earnings[BuildingCode.MUSHROOM_FARM]
    const plastic = this.getResourceEarnings({
      base: plastic_earnings.base,
      multiplier: plastic_earnings.multiplier,
      level: recycling_plant_level,
      coefficient: plastic_coefficient
    })
    const mushroom = this.getResourceEarnings({
      base: mushroom_earnings.base,
      multiplier: mushroom_earnings.multiplier,
      level: mushroom_farm_level,
      coefficient: mushroom_coefficient
    })
    return {
      plastic,
      mushroom
    }
  }

  private static getResourceEarnings({
    multiplier,
    level,
    base,
    coefficient
  }:{
    multiplier: number
    level: number
    base: number
    coefficient: number
  }): number {
    if (level === 0) {
      return 0
    }

    const base_value = Math.pow(multiplier, level - 1)*base
    const coefficient_value = base_value * coefficient

    return Math.round(coefficient_value * 100) / 100
  }
}
