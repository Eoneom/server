import { GenericResponse } from '../../response'

export interface SyncDataResponse {
  cities: {
    id: string
    name: string
    plastic: number
    mushroom: number
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

export type SyncResponse = GenericResponse<SyncDataResponse>
