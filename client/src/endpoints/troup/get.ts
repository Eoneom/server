import { TroupCode } from '../../../../src/core/troup/constant/code'
import { GenericResponse } from '../../response'
import { Requirement } from '../shared/requirement'

export interface TroupGetRequest {
  troup_id: string
}

export interface TroupGetDataResponse {
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
}

export type TroupGetResponse = GenericResponse<TroupGetDataResponse>
