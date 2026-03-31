import { GenericResponse } from '../../response'

export interface GameRefreshStateRequest {
  city_id: string
}

export type GameRefreshStateResponse = GenericResponse<void>
