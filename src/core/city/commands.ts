import { BuildingCommands } from '../building/commands'
import { BuildingQueries } from '../building/queries'
import { CityEntity } from './domain/entity'
import { CityErrors } from './domain/errors'
import { CityRepository } from './repository'

interface CreateCityCommand {
  name: string
  player_id: string
}

interface CityGatherResourcesCommand {
  id: string
  gather_at_time: number
}

interface CityPurchaseCommand {
  id: string
  costs: {
    plastic: number
    mushroom: number
  }
}

export class CityCommands {
  private repository: CityRepository
  private building_queries: BuildingQueries

  constructor({
    repository,
    building_queries,
  }: {
    repository: CityRepository,
    building_queries: BuildingQueries,
  }) {
    this.repository = repository
    this.building_queries = building_queries
  }

  async init({ name, player_id }: CreateCityCommand): Promise<string> {
    const city_already_exists = await this.repository.exists({ name })
    if (city_already_exists) {
      throw new Error(CityErrors.ALREADY_EXISTS)
    }

    const city = CityEntity.initCity({ name, player_id })

    return this.repository.create(city)
  }

  async purchase({ id, costs }: CityPurchaseCommand): Promise<void> {
    const city = await this.repository.findById(id)
    if (!city) {
      throw new Error(CityErrors.NOT_FOUND)
    }

    const updated_city = city.purchase({ plastic_cost: costs.plastic, mushroom_cost: costs.mushroom })
    await this.repository.updateOne(updated_city)
  }

  async gatherResources({ id, gather_at_time }: CityGatherResourcesCommand): Promise<void> {
    const city = await this.repository.findById(id)
    if (!city) {
      throw new Error(CityErrors.NOT_FOUND)
    }

    const earnings_by_second = await this.building_queries.getEarningsBySecond({ city_id: city.id })
    const { city: updated_city, updated } = city.gather({ earnings_by_second, gather_at_time })

    if (updated) {
      await this.repository.updateOne(updated_city)
    }
  }
}
