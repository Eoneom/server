import { BuildingCode } from '#core/building/constant'
import { RequirementValue } from '#core/requirement/value/requirement'
import { TechnologyCode } from '#core/technology/constant'

export const BuildingRequirement: Record<BuildingCode, RequirementValue> = {
  [BuildingCode.MUSHROOM_FARM]: {
    buildings: [],
    technologies: []
  },
  [BuildingCode.RECYCLING_PLANT]: {
    buildings: [],
    technologies: []
  },
  [BuildingCode.RESEARCH_LAB]: {
    buildings: [],
    technologies: []
  },
  [BuildingCode.UNIVERSITY]: {
    buildings: [],
    technologies: [
      {
        code: TechnologyCode.ARCHITECTURE,
        level: 2
      }
    ]
  }
}
