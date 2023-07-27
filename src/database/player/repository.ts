import { PlayerEntity } from '#core/player/entity'
import { PlayerRepository } from '#app/repository/player'
import {
  PlayerDocument, PlayerModel
} from '#database/player/document'
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
