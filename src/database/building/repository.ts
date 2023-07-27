import { BuildingEntity } from '#core/building/entity'
import { BuildingRepository } from '#app/repository/building'
import {
  BuildingDocument, BuildingModel
} from '#database/building/document'
import { MongoGenericRepository } from '#database/generic'

export class MongoBuildingRepository
  extends MongoGenericRepository<typeof BuildingModel, BuildingDocument, BuildingEntity>
  implements BuildingRepository {

  protected buildFromModel(document: BuildingDocument): BuildingEntity {
    return BuildingEntity.create({
      id: document._id.toString(),
      code: document.code,
      name: document.name,
      level: document.level,
      city_id: document.city_id.toString(),
      upgrade_at: document.upgrade_at
    })
  }
}
