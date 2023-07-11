import { GenericResponse } from '../../response'

export interface SyncRequest {
  player_id: string
}

export interface SyncDataResponse {
  player: {
    id: string
    name: string
  }
  cities: {
    id: string
    name: string
    plastic: number
    mushroom: number
    buildings: {
      id: string
      code: string
      level: number
      upgrade_at?: number
    }[]
  }[]
  technologies: {
    id: string
    code: string
    level: number
  }[]
}

export type SyncResponse = GenericResponse<SyncDataResponse>
