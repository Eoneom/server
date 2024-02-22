import { BuildingCode } from '#core/building/constant/code'

export interface WarehouseCapacity {
  base: number
  multiplier: number
}

export type WarehouseBuildingCode = BuildingCode.MUSHROOM_WAREHOUSE | BuildingCode.PLASTIC_WAREHOUSE
export type WarehouseBuildingLevels = Record<WarehouseBuildingCode, number>

export const warehouses_capacity: Record<WarehouseBuildingCode, WarehouseCapacity> = {
  [BuildingCode.MUSHROOM_WAREHOUSE]: {
    base: 3000,
    multiplier: 2
  },
  [BuildingCode.PLASTIC_WAREHOUSE]: {
    base: 4000,
    multiplier: 2
  }
}
