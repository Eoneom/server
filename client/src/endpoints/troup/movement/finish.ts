import { GenericResponse } from '../../../response'

interface TroupFinishMovementDataResponse {
  is_outpost_created: boolean
}

export type TroupFinishMovementResponse = GenericResponse<TroupFinishMovementDataResponse>
