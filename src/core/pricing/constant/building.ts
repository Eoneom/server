import { BuildingCode } from '#core/building/constant/code'
import { LevelCosts } from '#core/pricing/value/level'

export const building_costs: Record<BuildingCode, LevelCosts> = {
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
      base: 1,
      multiplier: 2
    }
  },
  [BuildingCode.PLASTIC_WAREHOUSE]: {
    plastic: {
      base: 500,
      multiplier: 2
    },
    mushroom: {
      base: 500,
      multiplier: 2
    },
    duration: {
      base: 120,
      multiplier: 1.7
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
      base: 1.5,
      multiplier: 2
    }
  },
  [BuildingCode.MUSHROOM_WAREHOUSE]: {
    plastic: {
      base: 500,
      multiplier: 2
    },
    mushroom: {
      base: 500,
      multiplier: 2
    },
    duration: {
      base: 120,
      multiplier: 1.7
    }
  },
  [BuildingCode.RESEARCH_LAB]: {
    plastic: {
      base: 10000,
      multiplier: 1.4
    },
    mushroom: {
      base: 10000,
      multiplier: 1.4,
    },
    duration: {
      base: 60,
      multiplier: 1.85
    }
  },
  [BuildingCode.UNIVERSITY]: {
    plastic: {
      base: 17000,
      multiplier: 1.3
    },
    mushroom: {
      base: 12000,
      multiplier: 1.2
    },
    duration: {
      base: 3600,
      multiplier: 1.5
    }
  }
}
