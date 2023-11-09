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
    const result = await new CityListQuery().get({ player_id })
    const response = response_mapper(result)

    return res.json({
      status: 'ok',
      data: response
    })
  } catch (err) {
    next(err)
  }
}

const response_mapper = ({ cities }: CityListQueryResponse): CityListDataResponse => {
  const cities_response: CityListDataResponse['cities'] = cities.map(city => {
    return {
      id: city.id,
      name: city.name,
    }
  })

  return { cities: cities_response }
}
