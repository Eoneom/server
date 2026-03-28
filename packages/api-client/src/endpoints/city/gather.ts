import { GenericResponse } from '../../response'

export interface CityGatherRequest {
  city_id: string
}

export type CityGatherResponse = GenericResponse<void>
