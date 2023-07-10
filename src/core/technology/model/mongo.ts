import { TechnologyDocument, TechnologyModel } from './document'

import { MongoGenericRepository } from '../../../database/generic'
import { TechnologyEntity } from '../domain/entity'
import { TechnologyRepository } from '.'

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
