import { BuildingCode } from '../../../../src/core/building/constants'
import { TechnologyCode } from '../../../../src/core/technology/constants'

export interface Requirement {
  buildings: {
    code: BuildingCode,
    level: number,
  }[],
  technologies: {
    code: TechnologyCode,
    level: number,
  }[]
}
