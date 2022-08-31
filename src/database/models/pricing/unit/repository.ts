import { UnitCostDocument, UnitCostModel } from './document'

import { MongoGenericRepository } from '../../../generic'
import { UnitCostEntity } from '../../../../core/pricing/domain/entities/unit'
import { UnitCostRepository } from '../../../../core/pricing/repository'

export class MongoUnitCostRepository
  extends MongoGenericRepository<typeof UnitCostModel, UnitCostDocument, UnitCostEntity>
  implements UnitCostRepository {
  protected buildFromModel(document: UnitCostDocument | null): UnitCostEntity | null {
    if (!document) {
      return null
    }

    return UnitCostEntity.create({
      id: document._id.toString(),
      code: document.code,
      resource: document.resource,
      duration: document.duration
    })
  }
}
