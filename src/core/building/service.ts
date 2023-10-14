import { BuildingCode } from '#core/building/constant/code'
import { building_earnings } from '#core/building/constant/earnings'
import { warehouses_capacity } from '#core/building/constant/warehouse-capacity'
import { BuildingEntity } from '#core/building/entity'
import { FAKE_ID } from '#shared/identification'
import { Resource } from '#shared/resource'

export class BuildingService {
  static init({ city_id }: { city_id: string }): BuildingEntity[] {
    return Object.values(BuildingCode).map(code => {
      return BuildingEntity.create({
        id: FAKE_ID,
        code,
        city_id,
        level: 0
      })
    })
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

  static getWarehouseCapacity({
    level,
    code
  }: {
    level: number
    code: BuildingCode.MUSHROOM_WAREHOUSE | BuildingCode.PLASTIC_WAREHOUSE
  }): number {
    const {
      multiplier,
      base
    } = warehouses_capacity[code]

    return Math.pow(multiplier, level)*base
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
