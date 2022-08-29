import { CityDocument, CityModel } from './document'

import { CityEntity } from '../../../core/city/domain/entity'
import { CityRepository } from '../../../core/city/repository'
import { MongoGenericRepository } from '../../generic'

export class MongoCityRepository extends MongoGenericRepository<typeof CityModel, CityDocument, CityEntity> implements CityRepository {
  protected buildFromModel(document: CityDocument | null): CityEntity | null {
    if (!document) {
      return null
    }

    return new CityEntity({
      id: document._id,
      name: document.name,
      wood: document.wood,
      last_wood_gather: document.last_wood_gather,
    })
  }
}
