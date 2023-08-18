import {
  NextFunction, Request, Response
} from 'express'
import {
  SyncResponse, SyncDataResponse
} from '#client/src/endpoints/player/sync'
import { getPlayerIdFromContext } from '#web/helpers'
import { RefreshCommand } from '#command/refresh'
import {
  SyncQuery, SyncQueryResponse
} from '#query/sync'

export const syncHandler = async (
  req: Request<void>,
  res: Response<SyncResponse>,
  next: NextFunction
) => {
  try {
    const player_id = getPlayerIdFromContext(res)

    const command = new RefreshCommand()
    await command.run({ player_id })

    const query = new SyncQuery()
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
}: SyncQueryResponse): SyncDataResponse => {
  const cities_response: SyncDataResponse['cities'] = cities.map(city => {
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
