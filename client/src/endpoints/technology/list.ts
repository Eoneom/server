import { TechnologyCode } from '../../../../src/core/technology/constants'
import { GenericResponse } from '../../response'
import { Requirement } from '../requirement'

export interface TechnologyListRequest {
  city_id: string
}

export interface TechnologyListDataResponse {
  technologies: {
    id: string
    code: TechnologyCode
    level: number
    research_cost: {
      plastic: number
      mushroom: number
      duration: number
    }
    research_at?: number
    requirements: Requirement
  }[]
}

export type TechnologyListResponse = GenericResponse<TechnologyListDataResponse>
