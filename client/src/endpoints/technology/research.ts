import { GenericResponse } from '../../response'

export interface TechnologyResearchRequest {
  city_id: string
  building_code: string
}

export type TechnologyResearchResponse = GenericResponse<undefined>
