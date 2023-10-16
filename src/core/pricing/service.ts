import { BuildingCode } from '#core/building/constant/code'
import {
  ARCHITECTURE_REDUCTION_PER_LEVEL,
  building_costs
} from '#core/pricing/constant/building'
import {
  RESEARCH_LABEL_REDUCTION_PER_LEVEL,
  technology_costs
} from '#core/pricing/constant/technology'
import {
  LevelCost, LevelCostValue
} from '#core/pricing/value/level'
import { TechnologyCode } from '#core/technology/constant'
import { TroupCode } from '#core/troup/constant'
import { CountCostValue } from '#core/pricing/value/count'
import { troup_costs } from '#core/pricing/constant/troup'
import { Resource } from '#shared/resource'

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

  static getBuildingUpgradeRefund({
    code,
    level
  }: {
    code: BuildingCode
    level: number
  }): Resource {
    const costs = this.getBuildingLevelCost({
      code,
      level,
      architecture_level: 0
    })

    return {
      plastic: Math.round(costs.resource.plastic/2),
      mushroom: Math.round(costs.resource.mushroom/2)
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

    const architecture_reduction = this.getLevelReduction({
      reduction_percent_per_level: ARCHITECTURE_REDUCTION_PER_LEVEL,
      level: architecture_level
    })

    return {
      code,
      level: level,
      resource: {
        plastic: this.computeLevelCost(plastic, level),
        mushroom: this.computeLevelCost(mushroom, level)
      },
      duration: this.computeLevelCost(duration, level, architecture_reduction)
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

    const research_lab_reduction = this.getLevelReduction({
      reduction_percent_per_level: RESEARCH_LABEL_REDUCTION_PER_LEVEL,
      level: research_lab_level
    })

    return {
      code,
      level: level,
      resource: {
        plastic: this.computeLevelCost(plastic, level),
        mushroom: this.computeLevelCost(mushroom, level)
      },
      duration: this.computeLevelCost(duration, level, research_lab_reduction)
    }
  }

  private static getLevelReduction({
    reduction_percent_per_level,
    level,
  }: {
    reduction_percent_per_level: number
    level: number
  }): number {
    return Math.pow(1-1/reduction_percent_per_level, level)
  }

  private static computeLevelCost(cost: LevelCost, level: number, reduction = 1): number {
    const base_level_cost = cost.base * Math.pow(cost.multiplier, level - 1)
    return Math.ceil(base_level_cost * reduction)
  }
}
