import { BuildingQueries } from '../building/queries'
import { CityEntity } from './domain/entity'
import { CityErrors } from './domain/errors'
import { CityEventCode } from './domain/events'
import { CityRepository } from './model'
import { Factory } from '../factory'
import { PricingQueries } from '../pricing/queries'
import { Resource } from '../../shared/resource'

interface CreateCityCommand {
  name: string
  player_id: string
}

interface CityPurchaseCommand {
  city: CityEntity
  cost: Resource
}

interface CityGatherResourcesCommand {
  id: string
  gather_at_time: number
}

export class CityCommands {
  private repository: CityRepository
  private building_queries: BuildingQueries
  private pricing_queries: PricingQueries

  constructor({
    repository,
    building_queries,
    pricing_queries
  }: {
    repository: CityRepository
    building_queries: BuildingQueries
    pricing_queries: PricingQueries
  }) {
    this.repository = repository
    this.building_queries = building_queries
    this.pricing_queries = pricing_queries
  }

  async settle({ name, player_id }: CreateCityCommand): Promise<{ city_id: string }> {
    const city = CityEntity.initCity({ name, player_id })
    const id = await this.repository.create(city)
    return {
      city_id: id
    }
  }

  async purchase({ city, cost }: CityPurchaseCommand): Promise<void> {
    const has_resources = city.hasResources(cost)
    if (!has_resources) {
      throw new Error(CityErrors.NOT_ENOUGH_RESOURCES)
    }

    const updated_city = city.purchase(cost)
    await this.repository.updateOne(updated_city)
  }

  async gatherResources({ id, gather_at_time }: CityGatherResourcesCommand): Promise<void> {
    const city = await this.repository.findById(id)
    if (!city) {
      throw new Error(CityErrors.NOT_FOUND)
    }

    const earnings_by_second = await this.building_queries.getEarningsBySecond({ city_id: city.id })
    const { city: updated_city, updated } = city.gather({ earnings_by_second, gather_at_time })

    if (!updated) {
      return
    }

    await this.repository.updateOne(updated_city)
    Factory.getEventBus().emit(CityEventCode.RESOURCES_GATHERED, {
      city_id: id,
      plastic: updated_city.plastic,
      mushroom: updated_city.mushroom
    })
  }
}
