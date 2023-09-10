import { GenericResponse } from '../../response'
import { Coordinates } from '../shared/coordinates'

export interface TroupExploreRequest {
  coordinates: Coordinates
  city_id: string
}

export type TroupExploreResponse = GenericResponse<void>
