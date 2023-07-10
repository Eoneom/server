import { PlayerDocument, PlayerModel } from './document'

import { MongoGenericRepository } from '../../../database/generic'
import { PlayerEntity } from '../domain/entity'
import { PlayerRepository } from '.'

export class MongoPlayerRepository
  extends MongoGenericRepository<typeof PlayerModel, PlayerDocument, PlayerEntity>
  implements PlayerRepository {
  protected buildFromModel(document: PlayerDocument): PlayerEntity {
    return PlayerEntity.create({
      id: document._id.toString(),
      name: document.name,
    })
  }
}
