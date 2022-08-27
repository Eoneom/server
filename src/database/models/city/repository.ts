import { CityDocument, CityModel } from './document'
import { CityRepository, FindParams } from '../../../core/city/repository'

import { CityEntity } from '../../../core/city/entity'

export class MongoCityRepository implements CityRepository {
  async findById(id: string): Promise<CityEntity | null> {
    const city = await CityModel.findById<CityDocument>(id)
    if (!city) {
      return null
    }

    return buildCityFromCityModel(city)
  }

  async findOne(query: FindParams): Promise<CityEntity | null> {
    const city = await CityModel.findOne<CityDocument>(query)
    if (!city) {
      return null
    }

    return buildCityFromCityModel(city)
  }

  async exists(name: string): Promise<boolean> {
    const existing = await CityModel.exists({ name })
    return Boolean(existing)
  }

  async create(city: CityEntity): Promise<string> {
    const created_city = await CityModel.create(city)
    return created_city._id.toString()
  }
}

const buildCityFromCityModel = (city: CityDocument): CityEntity => {
  return {
    id: city._id.toString(),
    name: city.name,
    wood: city.wood,
    last_wood_gather: city.last_wood_gather,
    buildings: {},
    cells: []
  }
}
