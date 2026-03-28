import { GenericResponse } from '../../response'

export interface TroopProgressRecruitRequest {
  city_id: string
}

export interface TroopProgressRecruitDataResponse {
  recruit_count: number
}

export type TroopProgressRecruitResponse = GenericResponse<TroopProgressRecruitDataResponse>
