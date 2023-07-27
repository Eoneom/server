import { TechnologyEntity } from '#core/technology/entity'
import { TechnologyRepository } from '#app/repository/technology'
import {
  TechnologyDocument, TechnologyModel
} from '#database/technology/document'
import { MongoGenericRepository } from '#database/generic'

export class MongoTechnologyRepository
  extends MongoGenericRepository<typeof TechnologyModel, TechnologyDocument, TechnologyEntity>
  implements TechnologyRepository {
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
