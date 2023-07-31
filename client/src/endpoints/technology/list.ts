import { GenericResponse } from '../../response'

export interface TechnologyListDataResponse {
  technologies: {
    id: string
    code: string
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
