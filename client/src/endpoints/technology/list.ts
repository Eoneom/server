import { TechnologyCode } from '../../../../src/core/technology/constants'
import { GenericResponse } from '../../response'

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
  }[]
}

export type TechnologyListResponse = GenericResponse<TechnologyListDataResponse>
