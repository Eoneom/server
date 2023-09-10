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

  protected buildFromModel(document: MovementDocument): MovementEntity {
    return MovementEntity.create({
      id: document._id.toString(),
      origin: document.origin,
      destination: document.destination,
      arrive_at: document.arrive_at
    })
  }
}
