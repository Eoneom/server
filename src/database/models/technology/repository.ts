import { TechnologyDocument, TechnologyModel } from './document'

import { MongoGenericRepository } from '../../generic'
import { TechnologyEntity } from '../../../core/technology/domain/entity'
import { TechnologyRepository } from '../../../core/technology/repository'

export class MongoTechnologyRepository
  extends MongoGenericRepository<typeof TechnologyModel, TechnologyDocument, TechnologyEntity>
  implements TechnologyRepository {
  protected buildFromModel(document: TechnologyDocument | null): TechnologyEntity | null {
    if (!document) {
      return null
    }

    return TechnologyEntity.create({
      id: document._id.toString(),
      player_id: document.player_id.toString(),
      code: document.code,
      level: document.level,
      research_time: document.research_time
    })
  }
}
