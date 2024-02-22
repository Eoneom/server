import { BuildingCode } from '#core/building/constant/code'

export interface Earnings {
  base: number
  multiplier: number
}

export type ProductionBuildingCode = BuildingCode.MUSHROOM_FARM | BuildingCode.RECYCLING_PLANT
export const production_building_codes = [
  BuildingCode.MUSHROOM_FARM,
  BuildingCode.RECYCLING_PLANT
]
export type ProductionBuildingLevels = Record<ProductionBuildingCode, number>

export const building_earnings: Record<ProductionBuildingCode, Earnings> = {
  [BuildingCode.RECYCLING_PLANT]: {
    base: 1.8,
    multiplier: 1.15
  },
  [BuildingCode.MUSHROOM_FARM]: {
    base: 1.5,
    multiplier: 1.20
  }
}
