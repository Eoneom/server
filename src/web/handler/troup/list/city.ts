import {
  NextFunction,
  Request,
  Response
} from 'express'
import { TroupListResponse } from '#client/src/endpoints/troup/list/shared'
import { getPlayerIdFromContext } from '#web/helpers'
import { TroupListQuery } from '#query/troup/list'
import { troupListResponseMapper } from '#web/handler/troup/list/mapper'

export const troupListCityHandler = async (
  req: Request,
  res: Response<TroupListResponse>,
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
    const result = await new TroupListQuery().run({
      player_id,
      location: {
        type: 'city',
        city_id,
      },
    })
    const response = troupListResponseMapper(result)

    return res.json({
      status: 'ok',
      data: response
    })
  } catch (err) {
    next(err)
  }
}


