import { GenericRepository } from '#app/port/repository/generic'
import { TroupCode } from '#core/troup/constant'
import { TroupEntity } from '#core/troup/entity'

export type TroupRepository = GenericRepository<TroupEntity> & {
  listInCity(query: { city_id: string }): Promise<TroupEntity[]>
  getInCity(query: { city_id: string, code: TroupCode }): Promise<TroupEntity>

  getInProgress(query: { city_id: string }): Promise<TroupEntity | null>
  isInProgress(query: { city_id: string }): Promise<boolean>

  listByMovement(query: { movement_id: string }): Promise<TroupEntity[]>
}
