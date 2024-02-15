import { TroupCode } from '../../../../../src/core/troup/constant/code'
import { GenericResponse } from '../../../response'

export interface TroupListDataResponse {
  troups: {
    id: string
    code: TroupCode
    count: number
    ongoing_recruitment?: {
      finish_at: number
      remaining_count: number
      duration_per_unit: number
    }
  }[]
}

export type TroupListResponse = GenericResponse<TroupListDataResponse>
