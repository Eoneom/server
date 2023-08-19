import { TotalCost } from '#core/pricing/constant'
import { TechnologyCode } from '#core/technology/constant'

export const technology_costs: Record<TechnologyCode, TotalCost> = {
  [TechnologyCode.ARCHITECTURE]: {
    plastic: {
      base: 4000,
      multiplier: 2
    },
    mushroom: {
      base: 4000,
      multiplier: 2
    },
    duration: {
      base: 60,
      multiplier: 2
    }
  }
}
