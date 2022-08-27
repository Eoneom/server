import { BuildingCode } from './constants'

export interface BuildingCreateParams {
  code: BuildingCode
  city_id: string
  level: number
}

export interface BuildingRepository {
  exists(query: { code: BuildingCode, city_id: string }): Promise<boolean>
  create(params: BuildingCreateParams): Promise<string>
  level(query: { code: BuildingCode, city_id: string }): Promise<number | null>
}
