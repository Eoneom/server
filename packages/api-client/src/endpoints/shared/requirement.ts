import { BuildingCode } from '@server-core/building/constant/code'
import { TechnologyCode } from '@server-core/technology/constant/code'

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
