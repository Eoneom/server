import { BuildingDocument, BuildingModel } from './document'

import { BuildingEntity } from '../../../core/building/domain/entity'
import { BuildingRepository } from '../../../core/ports/repository/building'
import { MongoGenericRepository } from '../../generic'

export class MongoBuildingRepository
  extends MongoGenericRepository<typeof BuildingModel, BuildingDocument, BuildingEntity>
  implements BuildingRepository {

  protected buildFromModel(document: BuildingDocument | null): BuildingEntity | null {
    if (!document) {
      return null
    }

    return new BuildingEntity({
      id: document._id.toString(),
      code: document.code,
      level: document.level,
      city_id: document.city_id.toString(),
      upgrade_time: document.upgrade_time
    })
  }
}
