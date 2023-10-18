import { TechnologyCode } from '../../../../src/core/technology/constant'
import { GenericResponse } from '../../response'

export interface TechnologyResearchRequest {
  city_id: string
  technology_code: TechnologyCode
}

export type TechnologyResearchResponse = GenericResponse<void>
