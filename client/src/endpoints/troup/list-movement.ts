import { MovementAction } from '../../../../src/core/troup/constant'
import { GenericResponse } from '../../response'
import { Coordinates } from '../shared/coordinates'

export interface TroupListMovementRequest {
  city_id: string
}

export interface TroupListMovementDataResponse {
  movements: {
    id: string
    action: MovementAction
    origin: Coordinates
    destination: Coordinates
    arrive_at: number
  }[]
}

export type TroupListMovementResponse = GenericResponse<TroupListMovementDataResponse>
