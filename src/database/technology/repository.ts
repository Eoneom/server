import { TechnologyEntity } from '#core/technology/entity'
import { TechnologyRepository } from '#app/repository/technology'
import {
  TechnologyDocument, TechnologyModel
} from '#database/technology/document'
import { MongoGenericRepository } from '#database/generic'
import { now } from '#shared/time'
import { TechnologyCode } from '#core/technology/constants'

export class MongoTechnologyRepository
  extends MongoGenericRepository<typeof TechnologyModel, TechnologyDocument, TechnologyEntity>
  implements TechnologyRepository {

  async list({
    player_id,
    codes
  }: {
    player_id: string
    codes?: TechnologyCode[]
  }): Promise<TechnologyEntity[]> {
    if (codes) {
      return this.find({
        player_id,
        code: { $in: codes }
      })
    }
    return this.find({ player_id })
  }

  async get(query: { player_id: string; code: TechnologyCode }): Promise<TechnologyEntity> {
    return this.findOneOrThrow(query)
  }

  async isInProgress({ player_id }: { player_id: string }): Promise<boolean> {
    return this.exists({
      player_id,
      upgrade_at: {
        $exists: true,
        $ne: null
      }
    })
  }

  async getResearchDone({ player_id }: { player_id: string }): Promise<TechnologyEntity | null> {
    return this.findOne({
      player_id,
      research_at: { $lte: now() }
    })
  }

  async getInProgress({ player_id }: { player_id: string }): Promise<TechnologyEntity | null> {
    return this.findOne({
      player_id,
      upgrade_at: {
        $exists: true,
        $ne: null
      }
    })
  }

  protected buildFromModel(document: TechnologyDocument): TechnologyEntity {
    return TechnologyEntity.create({
      id: document._id.toString(),
      player_id: document.player_id.toString(),
      code: document.code,
      level: document.level,
      research_at: document.research_at
    })
  }
}
