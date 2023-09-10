import { AuthRepository } from '#app/port/repository/auth'
import { BuildingRepository } from '#app/port/repository/building'
import { CityRepository } from '#app/port/repository/city'
import { PlayerRepository } from '#app/port/repository/player'
import { TechnologyRepository } from '#app/port/repository/technology'
import { CellRepository } from '#app/port/repository/cell'
import { BaseEntity } from '#core/type/base.entity'
import { TroupRepository } from '#app/port/repository/troup'
import { ExplorationRepository } from '#app/port/repository/exploration'
import { MovementRepository } from '#app/port/repository/movement'
import { ReportRepository } from '#app/port/repository/report'

export interface GenericRepository<Entity extends BaseEntity> {
  create(entity: Entity | Omit<Entity, 'id'>): Promise<string>
  updateOne(entity: Entity): Promise<void>
  delete(id: string): Promise<void>
}

export interface Repository {
  connect(): Promise<void>

  auth: AuthRepository
  building: BuildingRepository
  cell: CellRepository
  city: CityRepository
  exploration: ExplorationRepository
  movement: MovementRepository
  player: PlayerRepository
  report: ReportRepository
  technology: TechnologyRepository
  troup: TroupRepository
}
