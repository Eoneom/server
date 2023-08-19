import { BuildingCode } from '#core/building/constant'
import { Cost } from '#core/pricing/constant'
import { building_costs } from '#core/pricing/constant/building'
import { technology_costs } from '#core/pricing/constant/technology'
import { LevelCostValue } from '#core/pricing/value/level'
import { TechnologyCode } from '#core/technology/constant'

export class PricingService {
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
    return LevelCostValue.create({
      code,
      level: level,
      resource: {
        plastic: this.computeCost(plastic, level),
        mushroom: this.computeCost(mushroom, level)
      },
      duration: this.computeCost(duration, level, architecture_bonus)
    })
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
    return LevelCostValue.create({
      code,
      level: level,
      resource: {
        plastic: this.computeCost(plastic, level),
        mushroom: this.computeCost(mushroom, level)
      },
      duration: this.computeCost(duration, level, research_lab_bonus)
    })
  }

  private static computeCost(cost: Cost, level: number, bonus = 0): number {
    return Math.ceil(cost.base*Math.pow(cost.multiplier, level - 1)*(1-bonus))
  }
}
