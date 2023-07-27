import { AuthRepository } from '#app/repository/auth'
import { BuildingRepository } from '#app/repository/building'
import { CityRepository } from '#app/repository/city'
import { PlayerRepository } from '#app/repository/player'
import { TechnologyRepository } from '#app/repository/technology'
import { FilterQuery } from '#type/database'
import { BaseEntity } from '#type/domain'

export interface GenericRepository<Entity extends BaseEntity> {
  create(entity: Entity | Omit<Entity, 'id'>): Promise<string>
  exists(query: FilterQuery<Entity>): Promise<boolean>
  find(query: FilterQuery<Entity>): Promise<Entity[]>
  findById(id: string): Promise<Entity | null>
  findByIdOrThrow(id: string): Promise<Entity>
  findOne(query: FilterQuery<Entity>): Promise<Entity | null>
  findOneOrThrow(query: FilterQuery<Entity>): Promise<Entity>
  updateOne(entity: Entity): Promise<void>
}

export interface Repository {
  connect(): Promise<void>
  auth: AuthRepository
  building: BuildingRepository
  city: CityRepository
  player: PlayerRepository
  technology: TechnologyRepository
}
