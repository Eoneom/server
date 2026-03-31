import { GenericResponse } from '../../response'

export interface CityListDataResponse {
  cities: {
    id: string
    name: string
  }[]
  count_limit: number
}

export type CityListResponse = GenericResponse<CityListDataResponse>
