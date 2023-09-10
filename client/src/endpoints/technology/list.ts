import { TechnologyCode } from '../../../../src/core/technology/constant'
import { GenericResponse } from '../../response'
import { Requirement } from '../shared/requirement'

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
    requirement: Requirement
  }[]
}

export type TechnologyListResponse = GenericResponse<TechnologyListDataResponse>
