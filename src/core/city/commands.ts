import { BuildingQueries } from '../building/queries'
import { CityEntity } from './domain/entity'
import { CityErrors } from './domain/errors'
import { CityRepository } from './repository'

interface CreateCityCommand {
  name: string
}

interface CityGatherPlasticCommand {
  id: string
  gather_at_time: number
}

interface CityGatherMushroomCommand {
  id: string
  gather_at_time: number
}

interface CityPurchaseCommand {
  id: string
  plastic_cost?: number
  mushroom_cost?: number
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

  async init({ name }: CreateCityCommand): Promise<string> {
    const city_already_exists = await this.repository.exists({ name })
    if (city_already_exists) {
      throw new Error(CityErrors.ALREADY_EXISTS)
    }

    const city = CityEntity.initCity({ name })
    return this.repository.create(city)
  }

  async purchase({ id, plastic_cost = 0, mushroom_cost = 0 }: CityPurchaseCommand): Promise<void> {
    const city = await this.repository.findById(id)
    if (!city) {
      throw new Error(CityErrors.NOT_FOUND)
    }

    const updated_city = city.purchase({ plastic_cost, mushroom_cost })
    await this.repository.updateOne(updated_city)
  }

  async gatherPlastic({ id, gather_at_time }: CityGatherPlasticCommand): Promise<void> {
    const city = await this.repository.findById(id)
    if (!city) {
      throw new Error(CityErrors.NOT_FOUND)
    }

    const earnings_by_second = await this.building_queries.getPlasticEarningsBySecond({ city_id: city.id })
    const { city: updated_city, updated } = city.gatherPlastic({ earnings_by_second, gather_at_time })

    if (updated) {
      await this.repository.updateOne(updated_city)
    }
  }

  async gatherMushroom({ id, gather_at_time }: CityGatherMushroomCommand): Promise<void> {
    const city = await this.repository.findById(id)
    if (!city) {
      throw new Error(CityErrors.NOT_FOUND)
    }

    const earnings_by_second = await this.building_queries.getMushroomEarningsBySecond({ city_id: city.id })
    const { city: updated_city, updated } = city.gatherMushroom({ earnings_by_second, gather_at_time })

    if (updated) {
      await this.repository.updateOne(updated_city)
    }
  }
}
