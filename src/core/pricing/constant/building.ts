import { BuildingCode } from '#core/building/constants'
import { TotalCost } from '#core/pricing/constant'

export const building_costs: Record<BuildingCode, TotalCost> = {
  [BuildingCode.RECYCLING_PLANT]: {
    plastic: {
      base: 400,
      multiplier: 1.5
    },
    mushroom: {
      base: 200,
      multiplier: 1.3
    },
    duration: {
      base: 25,
      multiplier: 1.85
    }
  },
  [BuildingCode.MUSHROOM_FARM]: {
    plastic: {
      base: 200,
      multiplier: 1.3
    },
    mushroom: {
      base: 400,
      multiplier: 1.5,
    },
    duration: {
      base: 25,
      multiplier: 1.85
    }
  },
  [BuildingCode.RESEARCH_LAB]: {
    plastic: {
      base: 2000,
      multiplier: 1.4
    },
    mushroom: {
      base: 2000,
      multiplier: 1.4,
    },
    duration: {
      base: 60,
      multiplier: 1.85
    }
  },
}
