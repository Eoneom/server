import { CityEntity } from '#core/city/entity'
import { CityError } from '#core/city/error'
import { Resource } from '#shared/resource'

interface CityPurchaseParams {
  city: CityEntity
  cost: Resource
  player_id: string
}

export class CityService {
  static purchase({
    city,
    cost,
    player_id
  }: CityPurchaseParams): CityEntity {
    const is_city_owned_by_player = city.isOwnedBy(player_id)
    if (!is_city_owned_by_player) {
      throw new Error(CityError.NOT_OWNER)
    }

    return city.purchase(cost)
  }

  static refund({
    city,
    player_id,
    plastic,
    mushroom
  }: {
    city: CityEntity,
    player_id: string,
    plastic: number
    mushroom: number
  }): CityEntity {
    const is_city_owned_by_player = city.isOwnedBy(player_id)
    if (!is_city_owned_by_player) {
      throw new Error(CityError.NOT_OWNER)
    }

    return city.refund({
      plastic,
      mushroom
    })
  }

  static gatherResources({
    city,
    player_id,
    gather_at_time,
    earnings_per_second
  }: {
    city: CityEntity
    player_id: string
    gather_at_time: number
    earnings_per_second: Resource
  }): CityEntity | null {
    const is_city_owned_by_player = city.isOwnedBy(player_id)
    if (!is_city_owned_by_player) {
      throw new Error(CityError.NOT_OWNER)
    }

    const {
      city: updated_city,
      updated
    } = city.gather({
      earnings_per_second,
      gather_at_time
    })

    if (!updated) {
      return null
    }

    return updated_city
  }

  static settle({
    name,
    player_id,
    does_city_exist
  }: {
    name: string,
    player_id: string,
    does_city_exist: boolean
  }): CityEntity {
    if (does_city_exist) {
      throw new Error(CityError.ALREADY_EXISTS)
    }

    return CityEntity.initCity({
      name,
      player_id
    })
  }
}
