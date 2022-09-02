import { BuildingQueries } from '../building/queries'
import { CityEntity } from './domain/entity'
import { CityErrors } from './domain/errors'
import { CityEventCode } from './domain/events'
import { CityRepository } from './repository'
import { Factory } from '../factory'
import { PricingQueries } from '../pricing/queries'
import { TechnologyCode } from '../technology/domain/constants'
import { TechnologyQueries } from '../technology/queries'

interface CreateCityCommand {
  name: string
  player_id: string
}

interface CityPurchaseCommand {
  city_id: string
  code: string
  current_level: number
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

  async settle({ name, player_id }: CreateCityCommand): Promise<void> {
    const city_already_exists = await this.repository.exists({ name })
    if (city_already_exists) {
      throw new Error(CityErrors.ALREADY_EXISTS)
    }

    const city = CityEntity.initCity({ name, player_id })
    const id = await this.repository.create(city)
    Factory.getEventBus().emit(CityEventCode.SETTLED, { city_id: id })
  }

  async purchase({ city_id, code, current_level }: CityPurchaseCommand): Promise<void> {
    const city = await this.repository.findById(city_id)
    if (!city) {
      throw new Error(CityErrors.NOT_FOUND)
    }

    const { duration, resource } = await this.pricing_queries.getNextLevelCost({
      code,
      level: current_level
    })

    const updated_city = city.purchase(resource)
    await this.repository.updateOne(updated_city)

    Factory.getEventBus().emit(CityEventCode.PURCHASED, {
      city_id,
      player_id: city.player_id,
      code,
      duration
    })
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
    Factory.getEventBus().emit(CityEventCode.RESOURCES_GATHERED, { city_id: id })
  }
}
