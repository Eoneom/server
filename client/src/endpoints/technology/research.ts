import { GenericResponse } from '../../response'

export interface TechnologyResearchRequest {
  player_id: string
  city_id: string
  building_code: string
}

export type TechnologyResearchResponse = GenericResponse<undefined>
