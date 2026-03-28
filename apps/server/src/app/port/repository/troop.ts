import { GenericRepository } from '#app/port/repository/generic'
import { TroopCode } from '#core/troop/constant/code'
import { TroopEntity } from '#core/troop/entity'

export type TroopRepository = GenericRepository<TroopEntity> & {
  getById(id: string): Promise<TroopEntity>

  listInCell(query: { cell_id: string, player_id: string }): Promise<TroopEntity[]>
  getInCell(query: { cell_id: string, code: TroopCode }): Promise<TroopEntity>

  getInProgress(query: { cell_id: string }): Promise<TroopEntity | null>
  isInProgress(query: { cell_id: string }): Promise<boolean>

  listByMovement(query: { movement_id: string }): Promise<TroopEntity[]>
}
