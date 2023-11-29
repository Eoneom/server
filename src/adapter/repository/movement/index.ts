import { MovementEntity } from '#core/troup/movement.entity'
import { MovementRepository } from '#app/port/repository/movement'
import {
  MovementDocument,
  MovementModel
} from '#adapter/repository/movement/document'
import { MongoGenericRepository } from '#adapter/repository/generic'
import { TroupError } from '#core/troup/error'

export class MongoMovementRepository
  extends MongoGenericRepository<typeof MovementModel, MovementDocument, MovementEntity>
  implements MovementRepository {

  constructor() {
    super(MovementModel, TroupError.MOVEMENT_NOT_FOUND)
  }

  async get(id: string): Promise<MovementEntity> {
    return this.findByIdOrThrow(id)
  }

  async list({ player_id }: { player_id: string }): Promise<MovementEntity[]> {
    return this.find({ player_id })
  }

  protected buildFromModel(document: MovementDocument): MovementEntity {
    return MovementEntity.create({
      id: document._id.toString(),
      player_id: document.player_id.toString(),
      action: document.action,
      origin: document.origin,
      destination: document.destination,
      arrive_at: document.arrive_at
    })
  }
}
