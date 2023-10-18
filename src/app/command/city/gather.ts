import { GenericCommand } from '#app/command/generic'
import { AppService } from '#app/service'
import { CityEntity } from '#core/city/entity'
import { Resource } from '#shared/resource'

interface CityGatherRequest {
  city_id: string
  player_id: string
  gather_at_time: number
}

interface CityGatherExec {
  city: CityEntity
  earnings_per_second: Resource
  gather_at_time: number
  player_id: string
  warehouses_capacity: Resource
}

interface CityGatherSave {
  city: CityEntity
  updated: boolean
}

export class CityGatherCommand extends GenericCommand<
  CityGatherRequest,
  CityGatherExec,
  CityGatherSave
> {
  constructor() {
    super({ name:'city:gather' })
  }

  async fetch({
    city_id,
    player_id,
    gather_at_time
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
      warehouses_capacity,
      gather_at_time
    }
  }

  exec({
    city,
    earnings_per_second,
    player_id,
    warehouses_capacity,
    gather_at_time
  }: CityGatherExec): CityGatherSave {
    const {
      city: updated_city,
      updated
    } = city.gather({
      player_id,
      gather_at_time,
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
  }: CityGatherSave) {
    if (!updated) {
      return
    }

    await this.repository.city.updateOne(city)
  }
}
