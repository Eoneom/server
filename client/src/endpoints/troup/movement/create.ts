import { TroupCode } from '../../../../../src/core/troup/constant/code'
import { MovementAction } from '../../../../../src/core/troup/constant/movement-action'
import { GenericResponse } from '../../../response'
import { Coordinates } from '../../shared/coordinates'

export interface TroupMovementCreateRequest {
  origin: Coordinates
  destination: Coordinates
  action: MovementAction
  troups: {
    code: TroupCode
    count: number
  }[]
}

export type TroupMovementCreateResponse = GenericResponse<void>
