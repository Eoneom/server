import { CityDocument, CityModel } from './document'

import { CityEntity } from '../../../core/city/domain/entity'
import { CityRepository } from '../../../core/ports/repository/city'
import { MongoGenericRepository } from '../../generic'

export class MongoCityRepository extends MongoGenericRepository<typeof CityModel, CityDocument, CityEntity> implements CityRepository {
  protected buildFromModel(document: CityDocument | null): CityEntity | null {
    if (!document) {
      return null
    }

    return new CityEntity({ ...document, id: document._id })
  }
}
