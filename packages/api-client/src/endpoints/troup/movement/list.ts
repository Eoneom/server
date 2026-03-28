import { MovementAction } from '@server-core/troup/constant/movement-action'
import { GenericResponse } from '../../../response'
import { Coordinates } from '../../shared/coordinates'

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
