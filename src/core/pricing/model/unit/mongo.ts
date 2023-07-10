import { UnitCostDocument, UnitCostModel } from './document'

import { MongoGenericRepository } from '../../../../database/generic'
import { UnitCostEntity } from '../../domain/entities/unit'
import { UnitCostRepository } from '..'

export class MongoUnitCostRepository
  extends MongoGenericRepository<typeof UnitCostModel, UnitCostDocument, UnitCostEntity>
  implements UnitCostRepository {
  protected buildFromModel(document: UnitCostDocument): UnitCostEntity {
    return UnitCostEntity.create({
      id: document._id.toString(),
      code: document.code,
      resource: document.resource,
      duration: document.duration
    })
  }
}
