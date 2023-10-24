import { GenericResponse } from '../../response'
import { TroupCode } from '../../../../src/core/troup/constant/code'

export interface TroupRecruitRequest {
  city_id: string
  troup_code: TroupCode
  count: number
}

export type TroupRecruitResponse = GenericResponse<void>
