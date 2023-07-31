import { BuildingCode } from '#core/building/constants'
import { Cost } from '#core/pricing/constant'
import { building_costs } from '#core/pricing/constant/building'
import { technology_costs } from '#core/pricing/constant/technology'
import { LevelCostValue } from '#core/pricing/values/level'
import { TechnologyCode } from '#core/technology/constants'

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
      duration: Math.ceil(this.computeCost(duration, level) * (1 - architecture_bonus))
    })
  }

  static getTechnologyLevelCost({
    code,
    level
  }: {
    code: TechnologyCode
    level: number
  }): LevelCostValue {
    const {
      plastic,
      mushroom,
      duration
    } = technology_costs[code]

    return LevelCostValue.create({
      code,
      level: level,
      resource: {
        plastic: this.computeCost(plastic, level),
        mushroom: this.computeCost(mushroom, level)
      },
      duration: this.computeCost(duration, level)
    })
  }

  private static computeCost(cost: Cost, level: number): number {
    return Math.ceil(cost.base*Math.pow(cost.multiplier, level - 1))
  }
}
