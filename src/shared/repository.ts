import { BuildingRepository } from '#core/building/model'
import { CityRepository } from '#core/city/model'
import { PlayerRepository } from '#core/player/model'
import { LevelCostRepository, UnitCostRepository } from '#core/pricing/model'
import { TechnologyRepository } from '#core/technology/model'
import { FilterQuery } from '#type/database'
import { BaseEntity } from '#type/domain'

export interface GenericRepository<Entity extends BaseEntity> {
  exists(query: FilterQuery<Entity>): Promise<boolean>
  find(query: FilterQuery<Entity>): Promise<Entity[]>
  findById(id: string): Promise<Entity | null>
  findByIdOrThrow(id: string): Promise<Entity>
  findOne(query: FilterQuery<Entity>): Promise<Entity | null>
  findOneOrThrow(query: FilterQuery<Entity>): Promise<Entity>
  create(entity: Entity | Omit<Entity, 'id'>): Promise<string>
  updateOne(entity: Entity): Promise<void>
}

export interface Repository {
  connect(): Promise<void>
  city: CityRepository
  building: BuildingRepository
  player: PlayerRepository
  technology: TechnologyRepository
  level_cost: LevelCostRepository
  unit_cost: UnitCostRepository
}
