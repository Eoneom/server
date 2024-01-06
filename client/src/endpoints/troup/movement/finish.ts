import { GenericResponse } from '../../../response'

export interface TroupFinishMovementRequest {
  movement_id: string
}

export type TroupFinishMovementResponse = GenericResponse<void>
