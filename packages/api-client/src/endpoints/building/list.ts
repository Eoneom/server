import { BuildingCode } from '@server-core/building/constant/code'
import { GenericResponse } from '../../response'

export interface BuildingListRequest {
  city_id: string
}

export type BuildingListEntry =
  | {
      id: string
      code: BuildingCode
      level: number
      upgrade_at: number
      upgrade_started_at: number
    }
  | {
      id: string
      code: BuildingCode
      level: number
    }

export interface BuildingListDataResponse {
  buildings: BuildingListEntry[]
}

export type BuildingListResponse = GenericResponse<BuildingListDataResponse>
