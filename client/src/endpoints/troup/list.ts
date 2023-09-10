import { TroupCode } from '../../../../src/core/troup/constant'
import { GenericResponse } from '../../response'
import { Requirement } from '../shared/requirement'

export interface TroupListRequest {
  city_id: string
}

export interface TroupListDataResponse {
  troups: {
    id: string
    code: TroupCode
    count: number
    ongoing_recruitment?: {
      finish_at: number
      remaining_count: number
    }
    cost: {
      plastic: number
      mushroom: number
      duration: number
    }
    requirement: Requirement
  }[]
}

export type TroupListResponse = GenericResponse<TroupListDataResponse>
