import { GenericResponse } from '../../response'

export interface TroupCancelRequest {
  city_id: string
}

export type TroupCancelResponse = GenericResponse<undefined>
