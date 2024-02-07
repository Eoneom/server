import { TroupCode } from '../../../../../src/core/troup/constant/code'
import { MovementAction } from '../../../../../src/core/troup/constant/movement-action'
import { GenericResponse } from '../../../response'
import { Coordinates } from '../../shared/coordinates'

export interface TroupGetMovementRequest {
  movement_id: string
}

export interface TroupGetMovementDataResponse {
  action: MovementAction
  origin: Coordinates
  destination: Coordinates
  arrive_at: number
  troups: {
    code: TroupCode
    count: number
  }[]
}

export type TroupGetMovementResponse = GenericResponse<TroupGetMovementDataResponse>
