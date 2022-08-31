import { LevelCostDocument, LevelCostModel } from './document'

import { LevelCostEntity } from '../../../../core/pricing/domain/entities/level'
import { LevelCostRepository } from '../../../../core/pricing/repository'
import { MongoGenericRepository } from '../../../generic'

export class MongoLevelCostRepository
  extends MongoGenericRepository<typeof LevelCostModel, LevelCostDocument, LevelCostEntity>
  implements LevelCostRepository {

  protected buildFromModel(document: LevelCostDocument | null): LevelCostEntity | null {
    if (!document) {
      return null
    }

    return LevelCostEntity.create({
      id: document._id.toString(),
      code: document.code,
      level: document.level,
      resource: document.resource,
      duration: document.duration
    })
  }
}
