import {
  NextFunction,
  Request,
  Response
} from 'express'
import {
  CityListResponse,
  CityListDataResponse
} from '#client/src/endpoints/city/list'
import { getPlayerIdFromContext } from '#web/helpers'
import {
  CityListQuery,
  CityListQueryResponse
} from '#app/query/city/list'
import { Factory } from '#adapter/factory'

export const cityListHandler = async (
  req: Request,
  res: Response<CityListResponse>,
  next: NextFunction
) => {
  const logger = Factory.getLogger('web:handler:city:list')
  try {
    const player_id = getPlayerIdFromContext(res)
    logger.debug('query', { player_id })
    const query = new CityListQuery()
    const result = await query.get({ player_id })
    const response = response_mapper(result)

    return res.json({
      status: 'ok',
      data: response
    })
  } catch (err) {
    next(err)
  }
}

const response_mapper = ({
  cities,
  maximum_building_levels_by_city,
  earnings_per_second_by_city,
  cities_cells,
  warehouses_capacity_by_city
}: CityListQueryResponse): CityListDataResponse => {
  const cities_response: CityListDataResponse['cities'] = cities.map(city => {
    const earnings_per_second = earnings_per_second_by_city[city.id]
    const cell = cities_cells[city.id]
    const maximum_building_levels = maximum_building_levels_by_city[city.id]
    const warehouses_capacity = warehouses_capacity_by_city[city.id]
    return {
      id: city.id,
      name: city.name,
      plastic: city.plastic,
      mushroom: city.mushroom,
      maximum_building_levels,
      earnings_per_second: {
        plastic: earnings_per_second.plastic,
        mushroom: earnings_per_second.mushroom
      },
      warehouses_capacity: {
        plastic: warehouses_capacity.plastic,
        mushroom: warehouses_capacity.mushroom
      },
      coordinates: {
        x: cell.coordinates.x,
        y: cell.coordinates.y,
        sector: cell.coordinates.sector
      }
    }
  })

  return { cities: cities_response }
}
