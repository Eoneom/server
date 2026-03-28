import { GenericResponse } from '../../response'

export interface TroopCancelRequest {
  city_id: string
}

export type TroopCancelResponse = GenericResponse<undefined>
