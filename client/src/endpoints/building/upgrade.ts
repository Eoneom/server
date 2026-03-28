import { BuildingCode } from '@server-core/building/constant/code'
import { GenericResponse } from '../../response'

export interface BuildingUpgradeRequest {
  city_id: string
  building_code: BuildingCode
}

export type BuildingUpgradeResponse = GenericResponse<void>
