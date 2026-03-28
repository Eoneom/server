import { GenericResponse } from '../../response'

export interface BuildingFinishUpgradeRequest {
  city_id: string
}

export type BuildingFinishUpgradeResponse = GenericResponse<void>
