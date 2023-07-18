import { TechnologyEntity } from '#core/technology/domain/entity'
import { TechnologyRepository } from '#core/technology/model'
import { TechnologyDocument, TechnologyModel } from '#core/technology/model/document'
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
      researched_at: document.researched_at
    })
  }
}
