import { TroopCode } from '@server-core/troop/constant/code'
import { GenericResponse } from '../../../response'
import { Coordinates } from '../../shared/coordinates'

export interface TroopMovementEstimateRequest {
  origin: Coordinates
  destination: Coordinates
  troop_codes: TroopCode[]
}

export interface TroopMovementEstimateDataResponse {
  distance: number
  duration: number
  speed: number
}

export type TroopMovementEstimateResponse = GenericResponse<TroopMovementEstimateDataResponse>
