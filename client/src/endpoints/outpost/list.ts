import { GenericResponse } from '../../response'
import { Coordinates } from '../shared/coordinates'
import { OutpostType } from '../../../../src/core/outpost/constant/type'

export interface OutpostListDataResponse {
  outposts: {
    id: string
    coordinates: Coordinates
    type: OutpostType
  }[]
}

export type OutpostListResponse = GenericResponse<OutpostListDataResponse>
