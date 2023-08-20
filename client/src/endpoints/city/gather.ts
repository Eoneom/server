import { GenericResponse } from '../../response'

export interface CityGatherRequest {
  city_id: string
}

export interface CityGatherDataResponse {
  plastic: number
  mushroom: number
}

export type CityGatherResponse = GenericResponse<CityGatherDataResponse>
