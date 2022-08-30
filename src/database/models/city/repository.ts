import { CityDocument, CityModel } from './document'

import { CityEntity } from '../../../core/city/domain/entity'
import { CityRepository } from '../../../core/city/repository'
import { MongoGenericRepository } from '../../generic'

export class MongoCityRepository
  extends MongoGenericRepository<typeof CityModel, CityDocument, CityEntity>
  implements CityRepository {
  protected buildFromModel(document: CityDocument | null): CityEntity | null {
    if (!document) {
      return null
    }

    return CityEntity.create({
      id: document._id,
      name: document.name,
      plastic: document.plastic,
      mushroom: document.mushroom,
      last_plastic_gather: document.last_plastic_gather,
      last_mushroom_gather: document.last_mushroom_gather
    })
  }
}
