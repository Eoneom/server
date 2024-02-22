import { BuildingCode } from '#core/building/constant/code'
import { CityEntity } from '#core/city/entity'
import { CellEntity } from '#core/world/cell.entity'
import {
  ProductionBuildingCode,
  ProductionBuildingLevels,
  building_earnings
} from '#modules/resource/constant/production'
import {
  WarehouseBuildingCode,
  WarehouseBuildingLevels, warehouses_capacity
} from '#modules/resource/constant/warehouse-capacity'
import { Resource } from '#shared/resource'

export class ResourceService {
  static gather({
    city,
    cell,
    production_building_levels,
    warehouse_building_levels,
    gather_at_time
  }: {
    city: CityEntity
    cell: CellEntity
    production_building_levels: ProductionBuildingLevels
    warehouse_building_levels: WarehouseBuildingLevels
    gather_at_time: number
  }): {
    updated_city: CityEntity
    is_updated: boolean
  } {
    const earnings_per_second = this.getEarningsPerSecond({
      production_building_levels,
      cell
    })

    const warehouses_capacity = this.getWarehousesCapacity({ warehouse_building_levels })

    const {
      city: updated_city,
      is_updated
    } = city.gather({
      earnings_per_second,
      gather_at_time,
      warehouses_capacity
    })

    return {
      updated_city,
      is_updated
    }
  }

  static getWarehousesCapacity({ warehouse_building_levels }: { warehouse_building_levels: WarehouseBuildingLevels }): Resource {
    return {
      mushroom: this.getWarehouseCapacity({
        code: BuildingCode.MUSHROOM_WAREHOUSE,
        level: warehouse_building_levels[BuildingCode.MUSHROOM_WAREHOUSE]
      }),
      plastic: this.getWarehouseCapacity({
        code: BuildingCode.PLASTIC_WAREHOUSE,
        level: warehouse_building_levels[BuildingCode.PLASTIC_WAREHOUSE]
      }),
    }
  }

  static getEarningsPerSecond({
    production_building_levels,
    cell
  }: {
    cell: CellEntity
    production_building_levels: ProductionBuildingLevels
  }): Resource {
    const plastic = this.getResourceEarningsPerSecond({
      code: BuildingCode.RECYCLING_PLANT,
      level: production_building_levels[BuildingCode.RECYCLING_PLANT],
      coefficient: cell.resource_coefficient.plastic
    })

    const mushroom = this.getResourceEarningsPerSecond({
      code: BuildingCode.MUSHROOM_FARM,
      level: production_building_levels[BuildingCode.MUSHROOM_FARM],
      coefficient: cell.resource_coefficient.mushroom
    })

    return {
      plastic,
      mushroom
    }
  }

  private static getWarehouseCapacity({
    code,
    level
  }: {
    code: WarehouseBuildingCode
    level: number
  }) {

    const {
      multiplier,
      base
    } = warehouses_capacity[code]

    return Math.pow(multiplier, level)*base
  }

  private static getResourceEarningsPerSecond({
    code,
    level,
    coefficient,
  }: {
    code: ProductionBuildingCode
    level: number
    coefficient: number
  }): number {
    if (level === 0) {
      return 0
    }

    const {
      base,
      multiplier
    } = building_earnings[code]
    const base_value = Math.pow(multiplier, level - 1) * base

    const coefficient_value = base_value * coefficient

    return Math.round(coefficient_value * 100) / 100
  }
}
