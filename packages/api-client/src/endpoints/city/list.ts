import { GenericResponse } from '../../response'

export interface CityListDataResponse {
  cities: {
    id: string
    name: string
  }[]
}

export type CityListResponse = GenericResponse<CityListDataResponse>
