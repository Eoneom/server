import { AuthRepository } from '#app/repository/auth'
import { BuildingRepository } from '#app/repository/building'
import { CityRepository } from '#app/repository/city'
import { PlayerRepository } from '#app/repository/player'
import { TechnologyRepository } from '#app/repository/technology'
import { WorldRepository } from '#app/repository/world'
import { BaseEntity } from '#core/type/entity'

export interface GenericRepository<Entity extends BaseEntity> {
  create(entity: Entity | Omit<Entity, 'id'>): Promise<string>
  updateOne(entity: Entity): Promise<void>
}

export interface Repository {
  connect(): Promise<void>
  auth: AuthRepository
  building: BuildingRepository
  city: CityRepository
  player: PlayerRepository
  technology: TechnologyRepository
  world: WorldRepository
}
