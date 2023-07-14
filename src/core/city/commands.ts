import { CityEntity } from './domain/entity'
import { CityErrors } from './domain/errors'
import { CityRepository } from './model'
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
  city: CityEntity
  gather_at_time: number
  earnings_by_second: Resource
}

export class CityCommands {
  private repository: CityRepository

  constructor({
    repository,
  }: {
    repository: CityRepository
  }) {
    this.repository = repository
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

  async gatherResources({ city, gather_at_time, earnings_by_second }: CityGatherResourcesCommand): Promise<void> {
    const { city: updated_city, updated } = city.gather({ earnings_by_second, gather_at_time })

    if (!updated) {
      return
    }

    await this.repository.updateOne(updated_city)
  }
}
