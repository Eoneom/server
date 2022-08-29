import { BuildingCode } from '../../building/domain/constants'
import { BuildingEntity } from '../../building/domain/entity'
import { GenericRepository } from '.'

export interface BuildingCreateParams {
  code: BuildingCode
  city_id: string
  level: number
}

export interface BuildingRepository extends GenericRepository<BuildingEntity> { }
