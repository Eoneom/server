import { GenericResponse } from '../../response'

export interface TechnologyResearchRequest {
  city_id: string
  technology_code: string
}

interface TechnologyResearchDataResponse {
  research_at: number
}

export type TechnologyResearchResponse = GenericResponse<TechnologyResearchDataResponse>
