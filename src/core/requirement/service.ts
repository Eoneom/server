import { BuildingCode } from '#core/building/constant'
import { BuildingRequirement } from '#core/requirement/constant/building'
import { TechnologyRequirement } from '#core/requirement/constant/technology'
import { RequirementError } from '#core/requirement/error'
import { RequirementValue } from '#core/requirement/value/requirement'
import { TechnologyCode } from '#core/technology/constant'

export class RequirementService {
  static listBuildingRequirements(): typeof BuildingRequirement {
    return BuildingRequirement
  }
  static getTechnologyRequirement({ technology_code }: { technology_code: TechnologyCode }): RequirementValue {
    return TechnologyRequirement[technology_code]
  }
  static listTechnologyRequirements(): typeof TechnologyRequirement {
    return TechnologyRequirement
  }
  static checkTechnologyRequirement({
    technology_code,
    building_levels,
    technology_levels
  }: {
    technology_code: TechnologyCode,
    building_levels: Partial<Record<BuildingCode, number>>,
    technology_levels: Partial<Record<TechnologyCode, number>>
  }): void {
    const requirement = this.getTechnologyRequirement({ technology_code })
    requirement.buildings.forEach((requirement) => {
      const level = building_levels[requirement.code]
      if (!level || level < requirement.level) {
        throw new Error(RequirementError.BUILDING_NOT_FULFILLED)
      }
    })

    requirement.technologies.forEach((requirement) => {
      const level = technology_levels[requirement.code]
      if (!level || level < requirement.level) {
        throw new Error(RequirementError.TECHNOLOGY_NOT_FULFILLED)
      }
    })
  }
}
