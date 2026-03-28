import { GenericQuery } from '#query/generic'
import { AppService } from '#app/service'
import { Resource } from '#shared/resource'
import { now } from '#shared/time'
import { CellEntity } from '#core/world/cell/entity'
import { CityEntity } from '#core/city/entity'
import { CityService } from '#core/city/service'
import { CityError } from '#core/city/error'

export interface CityGetQueryRequest {
  city_id: string
  player_id: string
}

export interface CityGetQueryResponse {
  city: CityEntity
  earnings_per_second: Resource
  pre_cell_earnings_per_second: Resource
  cell_resource_coefficient: Resource
  maximum_building_levels: number
  building_levels_used: number
  cell: CellEntity
  warehouses_capacity: Resource
  warehouse_space_remaining: Resource
  warehouse_full_in_seconds: Resource
}

export class CityGetQuery extends GenericQuery<CityGetQueryRequest, CityGetQueryResponse> {
  constructor() {
    super({ name: 'city:get' })
  }

  protected async get({
    city_id,
    player_id
  }: CityGetQueryRequest): Promise<CityGetQueryResponse> {
    const city = await this.repository.city.get(city_id)
    if (!city.isOwnedBy(player_id)) {
      throw new Error(CityError.NOT_OWNER)
    }

    const [
      production,
      cell,
      maximum_building_levels,
      warehouses_capacity,
      building_levels_used,
    ] = await Promise.all([
      AppService.getCityProductionBreakdown({ city_id: city.id }),
      this.repository.cell.getCityCell({ city_id: city.id }),
      AppService.getCityMaximumBuildingLevels({ city_id: city.id }),
      AppService.getCityWarehousesCapacity({ city_id: city.id }),
      this.repository.building.getTotalLevels({ city_id: city.id }),
    ])

    const warehouse_space_remaining: Resource = {
      plastic: Math.max(0, warehouses_capacity.plastic - city.plastic),
      mushroom: Math.max(0, warehouses_capacity.mushroom - city.mushroom)
    }

    const { city: city_as_of_now } = city.gather({
      player_id,
      gather_at_time: now(),
      earnings_per_second: production.earnings_per_second,
      warehouses_capacity
    })

    const warehouse_full_in_seconds: Resource = {
      plastic: CityService.computeWarehouseFullInSeconds({
        space_remaining: warehouses_capacity.plastic - city_as_of_now.plastic,
        earnings_per_second: production.earnings_per_second.plastic
      }),
      mushroom: CityService.computeWarehouseFullInSeconds({
        space_remaining: warehouses_capacity.mushroom - city_as_of_now.mushroom,
        earnings_per_second: production.earnings_per_second.mushroom
      })
    }

    return {
      city,
      earnings_per_second: production.earnings_per_second,
      pre_cell_earnings_per_second: production.pre_cell_earnings_per_second,
      cell_resource_coefficient: production.cell_resource_coefficient,
      maximum_building_levels,
      building_levels_used,
      cell,
      warehouses_capacity,
      warehouse_space_remaining,
      warehouse_full_in_seconds
    }
  }
}
