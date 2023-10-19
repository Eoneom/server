import { GenericResponse } from '../../response'
import { TroupCode } from '../../../../src/core/troup/constant/code'

export interface TroupRecruitRequest {
  city_id: string
  troup_code: TroupCode
  count: number
}

interface TroupRecruitDataResponse {
  recruit_at: number
}

export type TroupRecruitResponse = GenericResponse<TroupRecruitDataResponse>
