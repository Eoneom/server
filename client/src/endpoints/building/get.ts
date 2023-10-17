import { BuildingCode } from '../../../../src/core/building/constant/code'
import { GenericResponse } from '../../response'
import { Requirement } from '../shared/requirement'

export interface BuildingGetRequest {
  city_id: string
  building_code: BuildingCode
}

interface BaseBuilding {
  code: BuildingCode
  level: number
  upgrade_cost: {
    plastic: number
    mushroom: number
    duration: number
  }
  upgrade_at?: number
  requirement: Requirement
  metadata: Record<string, unknown>
}

export type WarehouseBuilding = BaseBuilding & { metadata: { current_capacity: number, next_capacity: number } }
export const isWarehouseBuilding = (b: BaseBuilding): b is WarehouseBuilding => {
  return b.code === BuildingCode.PLASTIC_WAREHOUSE || b.code === BuildingCode.MUSHROOM_WAREHOUSE
}

export type ProductionBuilding = BaseBuilding & { metadata: { current_production: number, next_production: number } }
export const isProductionBuilding = (b: BaseBuilding): b is ProductionBuilding => {
  return b.code === BuildingCode.RECYCLING_PLANT || b.code === BuildingCode.MUSHROOM_FARM
}

export type BuildingGetDataResponse = WarehouseBuilding | BaseBuilding

export type BuildingGetResponse = GenericResponse<BuildingGetDataResponse>
