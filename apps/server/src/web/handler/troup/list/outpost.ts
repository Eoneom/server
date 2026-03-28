import {
  NextFunction,
  Request,
  Response
} from 'express'
import { TroupListResponse } from '#client/src/endpoints/troup/list/shared'
import { getPlayerIdFromContext } from '#web/helpers'
import { TroupListQuery } from '#query/troup/list'
import { troupListResponseMapper } from '#web/handler/troup/list/mapper'

export const troupListOutpostHandler = async (
  req: Request,
  res: Response<TroupListResponse>,
  next: NextFunction
) => {
  const outpost_id = req.params.outpost_id
  if (!outpost_id) {
    return res.status(400).json({
      status: 'nok',
      error_code: 'outpost_id:not-found'
    })
  }

  try {
    const player_id = getPlayerIdFromContext(res)
    const result = await new TroupListQuery().run({
      player_id,
      location: {
        type: 'outpost',
        outpost_id
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


