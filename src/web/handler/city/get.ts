import {
  NextFunction,
  Request,
  Response
} from 'express'
import {
  CityGetRequest,
  CityGetResponse,
  CityGetDataResponse
} from '#client/src/endpoints/city/get'
import { getPlayerIdFromContext } from '#web/helpers'
import {
  CityGetQuery,
  CityGetQueryResponse
} from '#app/query/city/get'

export const cityGetHandler = async (
  req: Request<CityGetRequest>,
  res: Response<CityGetResponse>,
  next: NextFunction
) => {
  const city_id = req.params.city_id
  if (!city_id) {
    return res.status(400).json({
      status: 'nok',
      error_code: 'city_id:not-found'
    })
  }

  try {
    const player_id = getPlayerIdFromContext(res)
    const query = new CityGetQuery()
    const result = await query.get({
      player_id,
      city_id
    })

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
  city,
  maximum_building_levels,
  earnings_per_second,
  cell,
  warehouses_capacity
}: CityGetQueryResponse): CityGetDataResponse => {
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
}
