import { LevelCostRepository, UnitCostRepository } from '../core/pricing/model'

import { BaseEntity } from '../types/domain'
import { BuildingRepository } from '../core/building/model'
import { CityRepository } from '../core/city/model'
import { FilterQuery } from '../types/database'
import { PlayerRepository } from '../core/player/model'
import { TechnologyRepository } from '../core/technology/model'

export interface GenericRepository<Entity extends BaseEntity> {
  exists(query: FilterQuery<Entity>): Promise<boolean>
  find(query: FilterQuery<Entity>): Promise<Entity[]>
  findById(id: string): Promise<Entity | null>
  findOne(query: FilterQuery<Entity>): Promise<Entity | null>
  create(entity: Omit<Entity, 'id'>): Promise<string>
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