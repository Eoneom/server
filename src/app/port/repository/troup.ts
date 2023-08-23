import { GenericRepository } from '#app/port/repository/generic'
import { TroupCode } from '#core/troup/constant'
import { TroupEntity } from '#core/troup/entity'

export type TroupRepository = GenericRepository<TroupEntity> & {
  getInCity(query: { city_id: string, code: TroupCode }): Promise<TroupEntity>

  isInProgress(query: { city_id: string }): Promise<boolean>
}
