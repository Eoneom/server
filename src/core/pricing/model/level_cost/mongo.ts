import { LevelCostDocument, LevelCostModel } from './document'

import { LevelCostEntity } from '../../domain/entities/level'
import { LevelCostRepository } from '..'
import { MongoGenericRepository } from '../../../../database/generic'

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
