import { GenericResponse } from '../../response'

export interface BuildingUpgradeRequest {
  player_id: string
  city_id: string
  building_code: string
}

export type BuildingUpgradeResponse = GenericResponse<undefined>
