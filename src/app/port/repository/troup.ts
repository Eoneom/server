import { GenericRepository } from '#app/port/repository/generic'
import { TroupCode } from '#core/troup/constant/code'
import { TroupEntity } from '#core/troup/entity'

export type TroupRepository = GenericRepository<TroupEntity> & {
  listInCell(query: { cell_id: string, player_id: string }): Promise<TroupEntity[]>
  getInCell(query: { cell_id: string, code: TroupCode }): Promise<TroupEntity>

  getInProgress(query: { cell_id: string }): Promise<TroupEntity | null>
  isInProgress(query: { cell_id: string }): Promise<boolean>

  listByMovement(query: { movement_id: string }): Promise<TroupEntity[]>
}
