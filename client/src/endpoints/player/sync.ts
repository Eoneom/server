import { GenericResponse } from '../../response'

export interface SyncRequest {
  player_id: string
}

export interface SyncDataResponse {
  player: {
    name: string
  }
  cities: {
    name: string
    plastic: number
    mushroom: number
    buildings: {
      code: string
      level: number
    }[]
  }[]
  technologies: {
    code: string
    level: number
  }[]
}

export type SyncResponse = GenericResponse<SyncDataResponse>
