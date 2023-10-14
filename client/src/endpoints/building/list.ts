import { BuildingCode } from '../../../../src/core/building/constant/code'
import { GenericResponse } from '../../response'
import { Requirement } from '../shared/requirement'

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
    requirement: Requirement
  }[]
}

export type BuildingListResponse = GenericResponse<BuildingListDataResponse>
