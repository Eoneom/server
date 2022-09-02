import { BuildingCode } from '../building/domain/constants'
import { BuildingQueries } from '../building/queries'
import { CityEntity } from './domain/entity'
import { CityErrors } from './domain/errors'
import { CityEventCode } from './domain/events'
import { CityRepository } from './repository'
import { Factory } from '../factory'
import { PricingQueries } from '../pricing/queries'

interface CreateCityCommand {
  name: string
  player_id: string
}

interface CityPurchaseBuildingCommand {
  city_id: string
  building_code: BuildingCode
}

interface CityGatherResourcesCommand {
  id: string
  gather_at_time: number
}

interface CityPurchaseCommand {
  id: string
  code: string
  current_level: number
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

  async purchaseBuilding({ city_id, building_code }: CityPurchaseBuildingCommand): Promise<void> {
    const city = await this.repository.findById(city_id)
    if (!city) {
      throw new Error(CityErrors.NOT_FOUND)
    }

    const current_building_level = await this.building_queries.getLevel({
      city_id: city_id,
      code: building_code
    })

    const { duration, resource } = await this.pricing_queries.getNextLevelCost({ code: building_code, level: current_building_level })
    const updated_city = city.purchase(resource)
    await this.repository.updateOne(updated_city)

    Factory.getEventBus().emit(CityEventCode.BUILDING_PURCHASED, {
      city_id,
      building_code,
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
