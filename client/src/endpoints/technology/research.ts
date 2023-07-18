import { GenericResponse } from '../../response'

export interface TechnologyResearchRequest {
  city_id: string
  technology_code: string
}

export type TechnologyResearchResponse = GenericResponse<undefined>
