import { AppService } from '#app/service'
import { GenericCommand } from '#command/generic'
import { CityEntity } from '#core/city/entity'
import { CityService } from '#core/city/service'
import { Resource } from '#shared/resource'
import { now } from '#shared/time'

export interface RefreshRequest {
  player_id: string
}

interface RefreshExec {
  cities: CityEntity[]
  earnings_per_second_by_city: Record<string, Resource>
}

interface RefreshSave {
  cities: Array<CityEntity | null>
}

export class RefreshCommand extends GenericCommand<
  RefreshRequest,
  RefreshExec,
  RefreshSave
> {
  async fetch({ player_id }: RefreshRequest): Promise<RefreshExec> {
    const cities = await this.repository.city.list({ player_id })
    const earnings = await Promise.all(cities.map(async city => {
      const earnings_per_second = await AppService.getCityEarningsBySecond({ city_id: city.id })
      return {
        city_id: city.id,
        earnings_per_second
      }
    }))

    const earnings_per_second_by_city = earnings.reduce((acc, current) => {
      return {
        ...acc,
        [current.city_id]: {
          plastic: current.earnings_per_second.plastic,
          mushroom: current.earnings_per_second.mushroom
        }
      }
    }, {})

    return {
      cities,
      earnings_per_second_by_city,
    }
  }

  exec({
    cities,
    earnings_per_second_by_city,
  }: RefreshExec): RefreshSave {
    const updated_cities = cities.map(city => {
      const earnings_per_second = earnings_per_second_by_city[city.id]
      return CityService.gatherResources({
        city,
        gather_at_time: now(),
        earnings_per_second
      })
    })

    return { cities: updated_cities }
  }

  async save({ cities }: RefreshSave): Promise<void> {
    await Promise.all(cities.map(city => city && this.repository.city.updateOne(city)))
  }
}
