import { GenericResponse } from '../../response'

export interface CityListDataResponse {
  cities: {
    id: string
    name: string
    plastic: number
    mushroom: number
    maximum_building_levels: number
    coordinates: {
      x: number
      y: number
      sector: number
    }
    earnings_per_second: {
      plastic: number
      mushroom: number
    }
  }[]
}

export type CityListResponse = GenericResponse<CityListDataResponse>
