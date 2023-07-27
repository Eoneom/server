import { BuildingCode } from '#core/building/constants'
import {
  building_costs, building_upgrade_durations_in_second, technology_costs, technology_research_durations_in_second
} from '#core/pricing/constants'
import { PricingErrors } from '#core/pricing/errors'
import { LevelCostValue } from '#core/pricing/values/level'
import { TechnologyCode } from '#core/technology/constants'

export class PricingService {
  static getBuildingLevelCost({
    code,
    level
  }: {
    code: BuildingCode
    level: number
  }): LevelCostValue {
    const resource = building_costs[code][level]
    const duration = building_upgrade_durations_in_second[code][level]
    if (!resource || !duration) {
      throw new Error(PricingErrors.LEVEL_COST_NOT_FOUND)
    }

    return LevelCostValue.create({
      code,
      level: level,
      resource,
      duration
    })
  }

  static getTechnologyLevelCost({
    code,
    level
  }: {
    code: TechnologyCode
    level: number
  }): LevelCostValue {
    const resource = technology_costs[code][level]
    const duration = technology_research_durations_in_second[code][level]
    if (!resource || !duration) {
      throw new Error(PricingErrors.LEVEL_COST_NOT_FOUND)
    }

    return LevelCostValue.create({
      code,
      level: level,
      resource,
      duration
    })
  }

}
