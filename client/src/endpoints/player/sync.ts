import { GenericResponse } from '../../response'

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
  }[]
  technologies: {
    id: string
    code: string
    level: number
    research_at?: number
  }[]
}

export type SyncResponse = GenericResponse<SyncDataResponse>
