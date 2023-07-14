import { CityEntity } from './domain/entity'
import { CityErrors } from './domain/errors'
import { CityRepository } from './model'
import { FilterQuery } from '../../type/database'

export class CityQueries {
  private repository: CityRepository

  public constructor({ repository }: { repository: CityRepository }) {
    this.repository = repository
  }

  public async canSettle({ name }: { name: string }): Promise<boolean> {
    const does_city_with_same_name_exists = await this.repository.exists({ name })
    return !does_city_with_same_name_exists
  }

  public async find(query: FilterQuery<CityEntity>): Promise<CityEntity[]> {
    return this.repository.find(query)
  }

  public async findOne(query: FilterQuery<CityEntity>): Promise<CityEntity | null> {
    return this.repository.findOne(query)
  }

  public async findByIdOrThrow(id: string): Promise<CityEntity> {
    const city = await this.repository.findById(id)
    if (!city) {
      throw new Error(CityErrors.NOT_FOUND)
    }

    return city
  }
}
