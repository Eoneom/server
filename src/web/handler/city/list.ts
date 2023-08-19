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

export const cityListHandler = async (
  req: Request,
  res: Response<CityListResponse>,
  next: NextFunction
) => {
  try {
    const player_id = getPlayerIdFromContext(res)
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
  earnings_per_second_by_city,
  cities_cells
}: CityListQueryResponse): CityListDataResponse => {
  const cities_response: CityListDataResponse['cities'] = cities.map(city => {
    const earnings_per_second = earnings_per_second_by_city[city.id]
    const cell = cities_cells[city.id]
    return {
      id: city.id,
      name: city.name,
      plastic: city.plastic,
      mushroom: city.mushroom,
      earnings_per_second: {
        plastic: earnings_per_second.plastic,
        mushroom: earnings_per_second.mushroom
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
