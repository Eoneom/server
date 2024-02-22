import { GenericQuery } from '#query/generic'
import { AppService } from '#app/service'
import { Resource } from '#shared/resource'
import { CellEntity } from '#core/world/cell.entity'
import { CityEntity } from '#core/city/entity'
import { CityError } from '#core/city/error'
import { ResourceService } from '#modules/resource/service'

export interface CityGetQueryRequest {
  city_id: string
  player_id: string
}

export interface CityGetQueryResponse {
  city: CityEntity
  earnings_per_second: Resource
  maximum_building_levels: number
  cell: CellEntity
  warehouses_capacity: Resource
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
      cell,
      maximum_building_levels,
      production_building_levels,
      warehouse_building_levels
    ] = await Promise.all([
      this.repository.cell.getCityCell({ city_id: city.id }),
      AppService.getCityMaximumBuildingLevels({ city_id: city.id }),
      this.repository.building.getProductionLevels(),
      this.repository.building.getWarehouseLevels()
    ])

    const earnings_per_second = ResourceService.getEarningsPerSecond({
      production_building_levels,
      cell
    })
    const warehouses_capacity = ResourceService.getWarehousesCapacity({ warehouse_building_levels })

    return {
      city,
      earnings_per_second,
      maximum_building_levels,
      cell,
      warehouses_capacity
    }
  }
}
