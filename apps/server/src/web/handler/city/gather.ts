import {
  NextFunction,
  Request,
  Response
} from 'express'
import {
  CityGatherRequest, CityGatherResponse
} from '#client/src/endpoints/city/gather'
import { getPlayerIdFromContext } from '#web/helpers'
import { sagaGather } from '#app/saga/gather'

export const cityGatherHandler = async (
  req: Request<CityGatherRequest>,
  res: Response<CityGatherResponse>,
  next: NextFunction
) => {
  const city_id = req.body.city_id
  if (!city_id) {
    return res.status(400).json({
      status: 'nok',
      error_code: 'city_id:not-found'
    })
  }

  try {
    const player_id = getPlayerIdFromContext(res)
    await sagaGather({
      city_id,
      player_id
    })

    return res.json({ status: 'ok' })
  } catch (err) {
    next(err)
  }
}
