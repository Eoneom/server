import { GenericResponse } from '../../response'
import { TroopCode } from '@server-core/troop/constant/code'

export interface TroopRecruitRequest {
  city_id: string
  troop_code: TroopCode
  count: number
}

export type TroopRecruitResponse = GenericResponse<void>
