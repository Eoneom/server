import { GenericCommand } from '#app/command/generic'
import { AppService } from '#app/service'
import { CityEntity } from '#core/city/entity'
import { Resource } from '#shared/resource'
import { now } from '#shared/time'

interface CityGatherRequest {
  city_id: string
  player_id: string
}

interface CityGatherExec {
  city: CityEntity
  earnings_per_second: Resource
  player_id: string
  warehouses_capacity: Resource
}

interface CityGatherSave {
  city: CityEntity
  updated: boolean
}

type CityGatherResponse = {
  plastic: number
  mushroom: number
}

export class CityGatherCommand extends GenericCommand<
  CityGatherRequest,
  CityGatherExec,
  CityGatherSave,
  CityGatherResponse
> {
  constructor() {
    super({ name:'city:gather' })
  }

  async fetch({
    city_id,
    player_id
  }: CityGatherRequest): Promise<CityGatherExec> {
    const [
      city,
      earnings_per_second,
      warehouses_capacity
    ] = await Promise.all([
      this.repository.city.get(city_id),
      AppService.getCityEarningsBySecond({ city_id }),
      AppService.getCityWarehousesCapacity({ city_id })
    ])

    return {
      city,
      earnings_per_second,
      player_id,
      warehouses_capacity
    }
  }
  exec({
    city,
    earnings_per_second,
    player_id,
    warehouses_capacity
  }: CityGatherExec): CityGatherSave {
    const {
      city: updated_city,
      updated
    } = city.gather({
      player_id,
      gather_at_time: now(),
      earnings_per_second,
      warehouses_capacity
    })

    return {
      city: updated ? updated_city : city,
      updated
    }
  }
  async save({
    city,
    updated
  }: CityGatherSave): Promise<CityGatherResponse> {
    if (!updated) {
      return city
    }

    await this.repository.city.updateOne(city)
    return {
      plastic: city.plastic,
      mushroom: city.mushroom
    }
  }
}
