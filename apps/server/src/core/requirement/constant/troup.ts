import { BuildingCode } from '#core/building/constant/code'
import { RequirementValue } from '#core/requirement/value/requirement'
import { TroupCode } from '#core/troup/constant/code'

export const TroupRequirement: Record<TroupCode, RequirementValue> = {
  [TroupCode.EXPLORER]: {
    buildings: [
      {
        code: BuildingCode.CLONING_FACTORY,
        level: 1
      }
    ],
    technologies: []
  },
  [TroupCode.SETTLER]: {
    buildings: [
      {
        code: BuildingCode.CLONING_FACTORY,
        level: 9
      }
    ],
    technologies: []
  },
  [TroupCode.LIGHT_TRANSPORTER]: {
    buildings: [
      {
        code: BuildingCode.CLONING_FACTORY,
        level: 5
      }
    ],
    technologies: []
  }
}
