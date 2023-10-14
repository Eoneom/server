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
  maximum_building_levels: number
  cell: CellEntity
  warehouses_capacity: Resource
}

export class CityGetQuery extends GenericQuery<CityGetQueryRequest, CityGetQueryResponse> {
  async get({
    city_id,
    player_id
  }: CityGetQueryRequest): Promise<CityGetQueryResponse> {
    const city = await this.repository.city.get(city_id)
    if (!city.isOwnedBy(player_id)) {
      throw new Error(CityError.NOT_OWNER)
    }

    const [
      earnings_per_second,
      cell,
      maximum_building_levels,
      warehouses_capacity
    ] = await Promise.all([
      AppService.getCityEarningsBySecond({ city_id: city.id }),
      this.repository.cell.getCityCell({ city_id: city.id }),
      AppService.getCityMaximumBuildingLevels({ city_id: city.id }),
      AppService.getCityWarehousesCapacity({ city_id: city.id })
    ])

    return {
      city,
      earnings_per_second,
      maximum_building_levels,
      cell,
      warehouses_capacity
    }
  }
}
