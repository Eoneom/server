import { GenericResponse } from '../../response'

export interface OutpostSetPermanentRequest {
  outpost_id: string
}

export type OutpostSetPermanentResponse = GenericResponse<void>
