import { GenericResponse } from '../../response'

export interface CitySettleRequest {
  outpost_id: string
  city_name: string
}

export interface CitySettleDataResponse {
  city_id: string
}

export type CitySettleResponse = GenericResponse<CitySettleDataResponse>
