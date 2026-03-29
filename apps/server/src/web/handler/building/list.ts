import {
  NextFunction,
  Request,
  Response
} from 'express'
import {
  BuildingListResponse
} from '@eoneom/api-client/src/endpoints/building/list'
import { getPlayerIdFromContext } from '#web/helpers'
import { BuildingListQuery } from '#query/building/list'

export const buildingListHandler = async (
  req: Request,
  res: Response<BuildingListResponse>,
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
    const data = await new BuildingListQuery().run({
      city_id,
      player_id
    })

    return res.json({
      status: 'ok',
      data
    })
  } catch (err) {
    next(err)
  }
}
