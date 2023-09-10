import { GenericResponse } from '../../response'

export interface TroupExploreRequest {
  coordinates: {
    x: number
    y: number
    sector: number
  }
  city_id: string
}

export type TroupExploreResponse = GenericResponse<void>
