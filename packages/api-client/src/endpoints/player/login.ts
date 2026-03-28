import { GenericResponse } from '../../response'

export interface LoginRequest {
  player_name: string
}

export type LoginResponse = GenericResponse<{
  token: string
}>
