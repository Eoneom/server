import { BuildingCode } from '../../../../src/core/building/constant'
import { GenericResponse } from '../../response'

export interface BuildingUpgradeRequest {
  city_id: string
  building_code: BuildingCode
}

export type BuildingUpgradeResponse = GenericResponse<{
  upgrade_at: number
}>
