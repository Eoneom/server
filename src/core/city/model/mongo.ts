import { CityEntity } from '#core/city/domain/entity'
import { CityRepository } from '#core/city/model'
import {
  CityDocument, CityModel 
} from '#core/city/model/document'
import { MongoGenericRepository } from '#database/generic'

export class MongoCityRepository
  extends MongoGenericRepository<typeof CityModel, CityDocument, CityEntity>
  implements CityRepository {
  protected buildFromModel(document: CityDocument): CityEntity {
    return CityEntity.create({
      id: document._id.toString(),
      player_id: document.player_id.toString(),
      name: document.name,
      plastic: document.plastic,
      mushroom: document.mushroom,
      last_plastic_gather: document.last_plastic_gather,
      last_mushroom_gather: document.last_mushroom_gather
    })
  }
}
