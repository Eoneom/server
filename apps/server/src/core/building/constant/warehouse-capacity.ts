import { BuildingCode } from '#core/building/constant/code'

export interface WarehouseCapacity {
  base: number
  multiplier: number
}

export const warehouses_capacity: Record<BuildingCode.MUSHROOM_WAREHOUSE | BuildingCode.PLASTIC_WAREHOUSE, WarehouseCapacity> = {
  [BuildingCode.MUSHROOM_WAREHOUSE]: {
    base: 3000,
    multiplier: 2
  },
  [BuildingCode.PLASTIC_WAREHOUSE]: {
    base: 4000,
    multiplier: 2
  }
}
