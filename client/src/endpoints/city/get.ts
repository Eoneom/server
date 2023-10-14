import { GenericResponse } from '../../response'
import { Coordinates } from '../shared/coordinates'

export interface CityGetRequest {
  city_id: string
}

export interface CityGetDataResponse {
  id: string
  name: string
  plastic: number
  mushroom: number
  maximum_building_levels: number
  coordinates: Coordinates
  earnings_per_second: {
    plastic: number
    mushroom: number
  }
  warehouses_capacity: {
    plastic: number
    mushroom: number
  }
}

export type CityGetResponse = GenericResponse<CityGetDataResponse>
