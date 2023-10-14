import { BuildingCode } from '#core/building/constant/code'

export interface Earnings {
  base: number
  multiplier: number
}

export const building_earnings: Record<BuildingCode.RECYCLING_PLANT | BuildingCode.MUSHROOM_FARM, Earnings> = {
  [BuildingCode.RECYCLING_PLANT]: {
    base: 1.2,
    multiplier: 1.15
  },
  [BuildingCode.MUSHROOM_FARM]: {
    base: 0.8,
    multiplier: 1.20
  }
}
