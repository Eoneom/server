import { GenericResponse } from '../../../response'

interface TroopFinishMovementDataResponse {
  is_outpost_created: boolean
}

export type TroopFinishMovementResponse = GenericResponse<TroopFinishMovementDataResponse>
