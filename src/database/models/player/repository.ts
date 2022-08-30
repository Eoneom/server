import { PlayerDocument, PlayerModel } from './document'

import { MongoGenericRepository } from '../../generic'
import { PlayerEntity } from '../../../core/player/domain/entity'
import { PlayerRepository } from '../../../core/player/repository'

export class MongoPlayerRepository
  extends MongoGenericRepository<typeof PlayerModel, PlayerDocument, PlayerEntity>
  implements PlayerRepository {
  protected buildFromModel(document: PlayerDocument | null): PlayerEntity | null {
    if (!document) {
      return null
    }

    return PlayerEntity.create({
      id: document._id.toString(),
      name: document.name,
    })
  }
}
