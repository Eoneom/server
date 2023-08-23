import { BuildingCode } from '#core/building/constant'
import { building_costs } from '#core/pricing/constant/building'
import { technology_costs } from '#core/pricing/constant/technology'
import {
  LevelCost, LevelCostValue
} from '#core/pricing/value/level'
import { TechnologyCode } from '#core/technology/constant'
import { TroupCode } from '#core/troup/constant'
import { CountCostValue } from '#core/pricing/value/count'
import { troup_costs } from '#core/pricing/constant/troup'

export class PricingService {
  static getTroupCost({
    code,
    count
  }: {
    code: TroupCode
    count: number
  }): CountCostValue {
    const cost = troup_costs[code]
    return {
      code,
      resource: {
        plastic: cost.plastic * count,
        mushroom: cost.mushroom * count
      },
      duration: cost.duration * count
    }
  }

  static getBuildingLevelCost({
    code,
    level,
    architecture_level
  }: {
    code: BuildingCode
    level: number
    architecture_level: number
  }): LevelCostValue {
    const {
      plastic,
      mushroom,
      duration
    } = building_costs[code]

    const architecture_bonus = architecture_level / 100
    return {
      code,
      level: level,
      resource: {
        plastic: this.computeLevelCost(plastic, level),
        mushroom: this.computeLevelCost(mushroom, level)
      },
      duration: this.computeLevelCost(duration, level, architecture_bonus)
    }
  }

  static getTechnologyLevelCost({
    code,
    level,
    research_lab_level
  }: {
    code: TechnologyCode
    level: number
    research_lab_level: number
  }): LevelCostValue {
    const {
      plastic,
      mushroom,
      duration
    } = technology_costs[code]

    const research_lab_bonus = research_lab_level / 100
    return {
      code,
      level: level,
      resource: {
        plastic: this.computeLevelCost(plastic, level),
        mushroom: this.computeLevelCost(mushroom, level)
      },
      duration: this.computeLevelCost(duration, level, research_lab_bonus)
    }
  }

  private static computeLevelCost(cost: LevelCost, level: number, bonus = 0): number {
    return Math.ceil(cost.base*Math.pow(cost.multiplier, level - 1)*(1-bonus))
  }
}
