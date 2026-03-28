import { PlayerEntity } from '#core/player/entity'
import { PlayerRepository } from '#app/port/repository/player'
import {
  PlayerDocument, PlayerModel
} from '#adapter/repository/player/document'
import { MongoGenericRepository } from '#adapter/repository/generic'
import { PlayerError } from '#core/player/error'
import { mongoose } from '@typegoose/typegoose'

export class MongoPlayerRepository
  extends MongoGenericRepository<typeof PlayerModel, PlayerDocument, PlayerEntity>
  implements PlayerRepository {

  constructor() {
    super(PlayerModel, PlayerError.NOT_FOUND)
  }

  get(id: string): Promise<PlayerEntity> {
    return this.findByIdOrThrow(id)
  }

  async exist(name: string): Promise<boolean> {
    return this.exists({ name })
  }

  async getByName(name: string): Promise<PlayerEntity> {
    return this.findOneOrThrow({ name })
  }

  async getInactivePlayerIds({ lookup_time }: { lookup_time: number }): Promise<string[]> {
    const results = await this.model.aggregate<{ _id: mongoose.Types.ObjectId }>([
      {
        '$lookup': {
          'from': 'auths',
          'localField': '_id',
          'foreignField': 'player_id',
          'as': 'authentications'
        }
      },
      {
        '$match': {
          '$or': [
            { 'authentications': { '$size': 0 } },
            { 'authentications': { '$not': { '$elemMatch': { 'last_action_at': { '$gt': lookup_time } } } } }
          ]
        }
      },
      { '$project': { '_id': 1 } }
    ])

    return results.map(result => result._id.toString())
  }

  protected buildFromModel(document: PlayerDocument): PlayerEntity {
    return PlayerEntity.create({
      id: document._id.toString(),
      name: document.name,
    })
  }
}
