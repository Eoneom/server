import { GenericRepository } from '#app/port/repository/generic'
import { MovementEntity } from '#core/troup/movement.entity'

export type MovementRepository = GenericRepository<MovementEntity>
