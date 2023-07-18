import { LevelCostEntity } from '#core/pricing/domain/entities/level'
import { LevelCostRepository } from '#core/pricing/model'
import { LevelCostDocument, LevelCostModel } from '#core/pricing/model/level_cost/document'
import { MongoGenericRepository } from '#database/generic'

export class MongoLevelCostRepository
  extends MongoGenericRepository<typeof LevelCostModel, LevelCostDocument, LevelCostEntity>
  implements LevelCostRepository {

  protected buildFromModel(document: LevelCostDocument): LevelCostEntity {
    return LevelCostEntity.create({
      id: document._id.toString(),
      code: document.code,
      level: document.level,
      resource: document.resource,
      duration: document.duration
    })
  }
}
