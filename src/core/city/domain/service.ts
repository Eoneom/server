import { CityEntity } from '#core/city/domain/entity'
import { CityErrors } from '#core/city/domain/errors'
import { Resource } from '#shared/resource'

interface CityPurchaseParams {
  city: CityEntity
  cost: Resource
  player_id: string
}

export class CityService {
  purchase({
    city, cost, player_id
  }: CityPurchaseParams): CityEntity {
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
}
