import { BuildingCode } from '#core/building/constant'
import { RequirementValue } from '#core/requirement/value/requirement'
import { TroupCode } from '#core/troup/constant'

export const TroupRequirement: Record<TroupCode, RequirementValue> = {
  [TroupCode.SCOUT]: {
    buildings: [
      {
        code: BuildingCode.UNIVERSITY,
        level: 1
      }
    ],
    technologies: []
  },
}
