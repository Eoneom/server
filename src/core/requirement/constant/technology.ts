import { BuildingCode } from '#core/building/constants'
import { RequirementValue } from '#core/requirement/value/requirement'
import { TechnologyCode } from '#core/technology/constants'

export const TechnologyRequirement: Record<TechnologyCode, RequirementValue> = {
  [TechnologyCode.ARCHITECTURE]: {
    buildings: [
      {
        code: BuildingCode.RESEARCH_LAB,
        level: 1
      }
    ],
    technologies: []
  }
}
