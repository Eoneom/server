import { AuthRepository } from '#app/port/repository/auth'
import { BuildingRepository } from '#app/port/repository/building'
import { CityRepository } from '#app/port/repository/city'
import { PlayerRepository } from '#app/port/repository/player'
import { TechnologyRepository } from '#app/port/repository/technology'
import { WorldRepository } from '#app/port/repository/world'
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
