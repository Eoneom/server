import { BaseEntity } from '../../types/domain'
import { BuildingRepository } from '../building/repository'
import { CityRepository } from '../city/repository'
import { FilterQuery } from '../../types/database'
import { PlayerRepository } from '../player/repository'

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
}
