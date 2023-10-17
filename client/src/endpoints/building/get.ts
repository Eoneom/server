import { BuildingCode } from '../../../../src/core/building/constant/code'
import { GenericResponse } from '../../response'
import { Requirement } from '../shared/requirement'

export interface BuildingGetRequest {
  city_id: string
  building_code: BuildingCode
}

export interface BuildingGetDataResponse {
  code: BuildingCode
  level: number
  upgrade_cost: {
    plastic: number
    mushroom: number
    duration: number
  }
  upgrade_at?: number
  requirement: Requirement
}

export type BuildingGetResponse = GenericResponse<BuildingGetDataResponse>
