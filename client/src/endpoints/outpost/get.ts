import { GenericResponse } from '../../response'
import { Coordinates } from '../shared/coordinates'
import { OutpostType } from '../../../../src/core/outpost/constant/type'

export interface OutpostGetRequest {
  outpost_id: string
}

export interface OutpostGetDataResponse {
  id: string
  coordinates: Coordinates
  type: OutpostType
}

export type OutpostGetResponse = GenericResponse<OutpostGetDataResponse>
