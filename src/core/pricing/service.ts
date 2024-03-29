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
import { TechnologyCode } from '#core/technology/constant/code'
import { TroupCode } from '#core/troup/constant/code'
import { CountCostValue } from '#core/pricing/value/count'
import {
  CLONING_FACTORY_REDUCTION_PER_LEVEL,
  REPLICATION_CATALYST_REDUCTION_PER_LEVEL,
  troup_costs
} from '#core/pricing/constant/troup'
import { Resource } from '#shared/resource'

export class PricingService {
  static getTroupCost({
    code,
    count,
    cloning_factory_level,
    replication_catalyst_level
  }: {
    code: TroupCode
    count: number
    cloning_factory_level: number
    replication_catalyst_level: number
  }): CountCostValue {
    const cost = troup_costs[code]

    const cloning_factory_reduction = this.getLevelReduction({
      reduction_percent_per_level: CLONING_FACTORY_REDUCTION_PER_LEVEL,
      level: cloning_factory_level
    })

    const replication_catalyst_reduction = this.getLevelReduction({
      reduction_percent_per_level: REPLICATION_CATALYST_REDUCTION_PER_LEVEL,
      level: replication_catalyst_level
    })

    const base_duration = cost.duration * count
    const total_reduction = cloning_factory_reduction * replication_catalyst_reduction
    const reduced_duration = Math.ceil(base_duration * total_reduction)

    return {
      code,
      resource: {
        plastic: cost.plastic * count,
        mushroom: cost.mushroom * count
      },
      duration: reduced_duration
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
