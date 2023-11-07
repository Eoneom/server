import { TechnologyCode } from '../../../../src/core/technology/constant/code'
import { GenericResponse } from '../../response'
import { Requirement } from '../shared/requirement'

export interface TechnologyGetRequest {
  city_id: string
  technology_code: TechnologyCode
}

export interface TechnologyGetDataResponse {
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
}

export type TechnologyGetResponse = GenericResponse<TechnologyGetDataResponse>
