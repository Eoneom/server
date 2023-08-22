import { GenericQuery } from '#query/generic'
import { AppService } from '#app/service'
import { Resource } from '#shared/resource'
import assert from 'assert'
import { CellEntity } from '#core/world/cell.entity'
import { CityEntity } from '#core/city/entity'

export interface CityListQueryRequest {
  player_id: string
}

export interface CityListQueryResponse {
  cities: CityEntity[],
  earnings_per_second_by_city: Record<string, Resource>
  maximum_building_levels_by_city: Record<string, number>
  cities_cells: Record<string, CellEntity>
}

export class CityListQuery extends GenericQuery<CityListQueryRequest, CityListQueryResponse> {
  async get({ player_id }: CityListQueryRequest): Promise<CityListQueryResponse> {
    const cities = await this.repository.city.list({ player_id })

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

    const cells = await Promise.all(cities.map(async city => this.repository.cell.getCityCell({ city_id: city.id })))

    const cities_cells = cells.reduce((acc, cell) => {
      assert(cell.city_id)
      return {
        ...acc,
        [cell.city_id]: cell
      }
    }, {} as Record<string, CellEntity>)

    const maximum_building_levels = await Promise.all(cities.map(async city => {
      const levels = await AppService.getCityMaximumBuildingLevels({ city_id: city.id })
      return {
        city_id: city.id,
        levels
      }
    }))

    const maximum_building_levels_by_city = maximum_building_levels.reduce((acc, current) => {
      return {
        ...acc,
        [current.city_id]: current.levels
      }
    }, {} as Record<string, number>)

    return {
      cities,
      earnings_per_second_by_city,
      maximum_building_levels_by_city,
      cities_cells
    }
  }
}
