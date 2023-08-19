import { BuildingCode } from '../../../../src/core/building/constant'
import { GenericResponse } from '../../response'

export interface BuildingListRequest {
  city_id: string
}

export interface BuildingListDataResponse {
  buildings: {
    id: string
    city_id: string
    code: BuildingCode
    level: number
    upgrade_cost: {
      plastic: number
      mushroom: number
      duration: number
    }
    upgrade_at?: number
  }[]
}

export type BuildingListResponse = GenericResponse<BuildingListDataResponse>
