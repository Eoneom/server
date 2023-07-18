import { GenericResponse } from '../../response'

export interface BuildingUpgradeRequest {
  city_id: string
  building_code: string
}

export type BuildingUpgradeResponse = GenericResponse<undefined>
