import { BuildingCode } from '#core/building/constants'
import { TechnologyCode } from '#core/technology/constants'

export interface RequirementValue {
  buildings: { code: BuildingCode, level: number }[]
  technologies: { code: TechnologyCode, level: number }[]
}
