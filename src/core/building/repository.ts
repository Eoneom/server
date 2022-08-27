import { BuildingCode } from './constants'
import { BuildingEntity } from './entity'

export interface BuildingCreateParams {
  code: BuildingCode
  city_id: string
  level: number
}

export interface BuildingRepository {
  findByCode(code: string): Promise<BuildingEntity | null>
  exists(query: { code: BuildingCode, city_id: string }): Promise<boolean>
  create(params: BuildingCreateParams): Promise<string>
  save(building: BuildingEntity): Promise<void>
  level(query: { code: BuildingCode, city_id: string }): Promise<number | null>
  getInProgress(query: { city_id: string }): Promise<BuildingEntity | null>
}
