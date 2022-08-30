import { BuildingQueries } from '../building/queries'
import { CityEntity } from './domain/entity'
import { CityErrors } from './domain/errors'
import { CityRepository } from './repository'
import { STARTING_PLASTIC } from './domain/constants'
import { now } from '../shared/time'

interface CreateCityCommand {
  name: string
}

interface CityGatherPlasticCommand {
  id: string
  gather_at_time: number
}

export class CityCommands {
  private repository: CityRepository
  private building_queries: BuildingQueries

  constructor({
    repository,
    building_queries
  }: {
    repository: CityRepository,
    building_queries: BuildingQueries
  }) {
    this.repository = repository
    this.building_queries = building_queries
  }

  async create({ name }: CreateCityCommand): Promise<string> {
    const city_already_exists = await this.repository.exists({ name })
    if (city_already_exists) {
      throw new Error(CityErrors.ALREADY_EXISTS)
    }

    const city = new CityEntity({
      id: 'fake',
      name,
      plastic: STARTING_PLASTIC,
      last_plastic_gather: new Date().getTime(),
    })

    return this.repository.create(city)
  }

  async gatherPlastic({ id, gather_at_time }: CityGatherPlasticCommand): Promise<void> {
    const city = await this.repository.findById(id)
    if (!city) {
      throw new Error(CityErrors.NOT_FOUND)
    }

    if (gather_at_time <= city.last_plastic_gather) {
      return
    }

    const seconds_since_last_gather = Math.round(gather_at_time - city.last_plastic_gather) / 1000
    if (seconds_since_last_gather < 1) {
      return
    }

    const earnings = await this.building_queries.getPlasticEarningsBySecond({ city_id: city.id })
    const plastic_earnings = Math.floor(seconds_since_last_gather * earnings)
    const updated_city = new CityEntity({
      ...city,
      plastic: city.plastic + plastic_earnings,
      last_plastic_gather: now()
    })

    await this.repository.updateOne(updated_city)
  }
}
