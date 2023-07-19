import { UnitCostEntity } from '#core/pricing/domain/entities/unit'
import { UnitCostRepository } from '#core/pricing/model'
import {
  UnitCostDocument, UnitCostModel 
} from '#core/pricing/model/unit_cost/document'
import { MongoGenericRepository } from '#database/generic'

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
