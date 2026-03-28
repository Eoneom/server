import { GenericResponse } from '../../response'

export interface BuildingCancelRequest {
  city_id: string
}

export type BuildingCancelResponse = GenericResponse<undefined>
