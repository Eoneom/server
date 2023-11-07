import { TechnologyCode } from '../../../../src/core/technology/constant/code'
import { GenericResponse } from '../../response'

export interface TechnologyListDataResponse {
  technologies: {
    id: string
    code: TechnologyCode
    level: number
    research_at?: number
  }[]
}

export type TechnologyListResponse = GenericResponse<TechnologyListDataResponse>
