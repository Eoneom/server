import { BuildingCode } from '#core/building/constant'
import { TechnologyCode } from '#core/technology/constant'

export interface RequirementValue {
  buildings: { code: BuildingCode, level: number }[]
  technologies: { code: TechnologyCode, level: number }[]
}
