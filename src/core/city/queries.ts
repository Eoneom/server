import { CityEntity } from '#core/city/domain/entity'
import { CityErrors } from '#core/city/domain/errors'
import { CityRepository } from '#core/city/model'
import { FilterQuery } from '#type/database'

export class CityQueries {
  private repository: CityRepository

  public constructor({ repository }: { repository: CityRepository }) {
    this.repository = repository
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
