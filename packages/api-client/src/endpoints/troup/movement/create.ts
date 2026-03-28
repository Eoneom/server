import { TroupCode } from '@server-core/troup/constant/code'
import { MovementAction } from '@server-core/troup/constant/movement-action'
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

interface TroupMovementCreateDataResponse {
  deleted_outpost_id?: string
}

export type TroupMovementCreateResponse = GenericResponse<TroupMovementCreateDataResponse>
