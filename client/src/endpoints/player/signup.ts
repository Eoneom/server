import { GenericResponse } from '../../response'

export interface SignupRequest {
  player_name: string
}

export type SignupResponse = GenericResponse<{
  player_id: string
  city_id: string
}>
