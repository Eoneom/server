import { TroopCode } from '@server-core/troop/constant/code'
import { GenericResponse } from '../../../response'

export interface TroopListDataResponse {
  troops: {
    id: string
    code: TroopCode
    count: number
    ongoing_recruitment?: {
      finish_at: number
      remaining_count: number
      duration_per_unit: number
    }
  }[]
}

export type TroopListResponse = GenericResponse<TroopListDataResponse>
