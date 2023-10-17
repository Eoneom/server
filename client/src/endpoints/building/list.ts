import { BuildingCode } from '../../../../src/core/building/constant/code'
import { GenericResponse } from '../../response'

export interface BuildingListRequest {
  city_id: string
}

export interface BuildingListDataResponse {
  buildings: {
    id: string
    code: BuildingCode
    level: number
    upgrade_at?: number
  }[]
}

export type BuildingListResponse = GenericResponse<BuildingListDataResponse>
