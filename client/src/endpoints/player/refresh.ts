import { GenericResponse } from '../../response'

export interface RefreshRequest {
  player_id: string
}

export type RefreshResponse = GenericResponse<undefined>
