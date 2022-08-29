import { BuildingCode } from '../../building/constants'
import { BuildingDocument } from '../../../database/models/building/document'
import { BuildingEntity } from '../../building/entity'
import { mongoose } from '@typegoose/typegoose'

export interface BuildingCreateParams {
  code: BuildingCode
  city_id: string
  level: number
}

export interface BuildingFindOneParams {
  code: string
  city_id: string
}

export interface BuildingRepository {
  findOne(query: mongoose.FilterQuery<BuildingDocument>): Promise<BuildingEntity | null>
  findOne(query: BuildingFindOneParams): Promise<BuildingEntity | null>
  exists(query: { code: BuildingCode, city_id: string }): Promise<boolean>
  create(params: BuildingCreateParams): Promise<string>
  save(building: BuildingEntity): Promise<void>
  level(query: { code: BuildingCode, city_id: string }): Promise<number | null>
  getInProgress(query: { city_id: string }): Promise<BuildingEntity | null>
}
