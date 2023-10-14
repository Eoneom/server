import { BuildingCode } from '#core/building/constant/code'
import { BuildingRequirement } from '#core/requirement/constant/building'
import { TechnologyRequirement } from '#core/requirement/constant/technology'
import { TroupRequirement } from '#core/requirement/constant/troup'
import { RequirementError } from '#core/requirement/error'
import { RequirementValue } from '#core/requirement/value/requirement'
import { TechnologyCode } from '#core/technology/constant'
import { TroupCode } from '#core/troup/constant'

export interface Levels {
  building: Partial<Record<BuildingCode, number>>
  technology: Partial<Record<TechnologyCode, number>>
}

export class RequirementService {
  static listTroupRequirements(): typeof TroupRequirement {
    return TroupRequirement
  }
  static getTroupRequirement({ troup_code }: { troup_code: TroupCode }): RequirementValue {
    return TroupRequirement[troup_code]
  }
  static checkTroupRequirement({
    troup_code,
    levels
  }: {
    troup_code: TroupCode,
    levels: Levels
  }): void {
    const requirement = this.getTroupRequirement({ troup_code })
    return this.checkRequirement({
      requirement,
      levels
    })
  }

  static listBuildingRequirements(): typeof BuildingRequirement {
    return BuildingRequirement
  }
  static getBuildingRequirement({ building_code }: { building_code: BuildingCode }): RequirementValue {
    return BuildingRequirement[building_code]
  }
  static checkBuildingRequirement({
    building_code,
    levels
  }: {
    building_code: BuildingCode
    levels: Levels
  }): void {
    const requirement = this.getBuildingRequirement({ building_code })
    return this.checkRequirement({
      requirement,
      levels
    })
  }

  static getTechnologyRequirement({ technology_code }: { technology_code: TechnologyCode }): RequirementValue {
    return TechnologyRequirement[technology_code]
  }
  static listTechnologyRequirements(): typeof TechnologyRequirement {
    return TechnologyRequirement
  }
  static checkTechnologyRequirement({
    technology_code,
    levels
  }: {
    technology_code: TechnologyCode
    levels: Levels
  }): void {
    const requirement = this.getTechnologyRequirement({ technology_code })
    return this.checkRequirement({
      requirement,
      levels
    })
  }

  private static checkRequirement({
    requirement,
    levels
  }: {
    requirement: RequirementValue,
    levels: Levels
   }): void {
    requirement.buildings.forEach((requirement) => {
      const level = levels.building[requirement.code]
      if (!level || level < requirement.level) {
        throw new Error(RequirementError.BUILDING_NOT_FULFILLED)
      }
    })

    requirement.technologies.forEach((requirement) => {
      const level = levels.technology[requirement.code]
      if (!level || level < requirement.level) {
        throw new Error(RequirementError.TECHNOLOGY_NOT_FULFILLED)
      }
    })
  }
}
