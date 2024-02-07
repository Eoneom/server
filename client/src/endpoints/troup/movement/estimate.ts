import { TroupCode } from '../../../../../src/core/troup/constant/code'
import { GenericResponse } from '../../../response'
import { Coordinates } from '../../shared/coordinates'

export interface TroupMovementEstimateRequest {
  origin: Coordinates
  destination: Coordinates
  troup_codes: TroupCode[]
}

export interface TroupMovementEstimateDataResponse {
  distance: number
  duration: number
  speed: number
}

export type TroupMovementEstimateResponse = GenericResponse<TroupMovementEstimateDataResponse>
