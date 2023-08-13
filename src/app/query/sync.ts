import { GenericQuery } from '#query/generic'
import { AppService } from '#app/service'
import { CityEntity } from '#core/city/entity'
import { PlayerEntity } from '#core/player/entity'
import { Resource } from '#shared/resource'

interface SyncRequest {
  player_id: string
}

export interface SyncQueryResponse {
  player: PlayerEntity
  cities: CityEntity[],
  earnings_per_second_by_city: Record<string, Resource>
}

export class SyncQuery extends GenericQuery<SyncRequest, SyncQueryResponse> {
  async get({ player_id }: SyncRequest): Promise<SyncQueryResponse> {
    const [
      player,
      cities,
    ] = await Promise.all([
      this.repository.player.get(player_id),
      this.repository.city.list({ player_id })
    ])

    const earnings_per_second = await Promise.all(cities.map(async city => {
      const earnings = await AppService.getCityEarningsBySecond({ city_id: city.id })
      return {
        city_id: city.id,
        ...earnings
      }
    }))

    const earnings_per_second_by_city = earnings_per_second.reduce((acc, earnings) => {
      return {
        ...acc,
        [earnings.city_id]: {
          plastic: earnings.plastic,
          mushroom: earnings.mushroom
        }
      }
    }, {} as Record<string, Resource>)

    return {
      player,
      cities,
      earnings_per_second_by_city
    }
  }
}
