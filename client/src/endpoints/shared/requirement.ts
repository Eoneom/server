import { BuildingCode } from '../../../../src/core/building/constant/code'
import { TechnologyCode } from '../../../../src/core/technology/constant'

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
