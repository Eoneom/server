import { PlayerEntity } from '#core/player/domain/entity'
import { PlayerRepository } from '#core/player/model'
import {
  PlayerDocument, PlayerModel 
} from '#core/player/model/document'
import { MongoGenericRepository } from '#database/generic'

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
