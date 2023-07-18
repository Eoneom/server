import { CityEntity } from '#core/city/domain/entity'
import { CityErrors } from '#core/city/domain/errors'
import { CityRepository } from '#core/city/model'
import { Resource } from '#shared/resource'

interface CreateCityCommand {
  name: string
  player_id: string
}

interface CityPurchaseCommand {
  city: CityEntity
  cost: Resource
  player_id: string
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

  async settle({ name, player_id }: CreateCityCommand): Promise<CityEntity> {
    const existing_city = await this.repository.exists({ name })
    if (existing_city) {
      throw new Error(CityErrors.ALREADY_EXISTS)
    }

    return CityEntity.initCity({ name, player_id })
  }

  async purchase({ city, cost, player_id }: CityPurchaseCommand): Promise<CityEntity> {
    const is_city_owned_by_player = city.isOwnedBy(player_id)
    if (!is_city_owned_by_player) {
      throw new Error(CityErrors.NOT_OWNER)
    }

    const has_resources = city.hasResources(cost)
    if (!has_resources) {
      throw new Error(CityErrors.NOT_ENOUGH_RESOURCES)
    }

    return city.purchase(cost)
  }

  async gatherResources({ city, gather_at_time, earnings_by_second }: CityGatherResourcesCommand): Promise<void> {
    const { city: updated_city, updated } = city.gather({ earnings_by_second, gather_at_time })

    if (!updated) {
      return
    }

    await this.repository.updateOne(updated_city)
  }
}
