import { GenericResponse } from '../../response'

export interface TroupProgressRecruitRequest {
  city_id: string
}

export interface TroupProgressRecruitDataResponse {
  recruit_count: number
}

export type TroupProgressRecruitResponse = GenericResponse<TroupProgressRecruitDataResponse>
