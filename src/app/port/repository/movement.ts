import { GenericRepository } from '#app/port/repository/generic'
import { MovementEntity } from '#core/troup/movement.entity'

export type MovementRepository = GenericRepository<MovementEntity> & {
  listInCity(query: { city_id: string }): Promise<MovementEntity[]>
  get(id: string): Promise<MovementEntity>
}
