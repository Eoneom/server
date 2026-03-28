import { GenericQuery } from '#query/generic'
import { AppService } from '#app/service'
import { Resource } from '#shared/resource'
import { CellEntity } from '#core/world/cell.entity'
import { CityEntity } from '#core/city/entity'
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
  cell: CellEntity
  warehouses_capacity: Resource
  warehouse_space_remaining: Resource
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
      warehouses_capacity
    ] = await Promise.all([
      AppService.getCityProductionBreakdown({ city_id: city.id }),
      this.repository.cell.getCityCell({ city_id: city.id }),
      AppService.getCityMaximumBuildingLevels({ city_id: city.id }),
      AppService.getCityWarehousesCapacity({ city_id: city.id })
    ])

    const warehouse_space_remaining: Resource = {
      plastic: Math.max(0, warehouses_capacity.plastic - city.plastic),
      mushroom: Math.max(0, warehouses_capacity.mushroom - city.mushroom)
    }

    return {
      city,
      earnings_per_second: production.earnings_per_second,
      pre_cell_earnings_per_second: production.pre_cell_earnings_per_second,
      cell_resource_coefficient: production.cell_resource_coefficient,
      maximum_building_levels,
      cell,
      warehouses_capacity,
      warehouse_space_remaining
    }
  }
}
