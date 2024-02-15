import { CitySettleCommand } from '#app/command/city/settle'
import {
  CitySettleRequest,
  CitySettleResponse
} from '#client/src/endpoints/city/settle'
import { getPlayerIdFromContext } from '#web/helpers'
import {
  NextFunction,
  Request,
  Response
} from 'express'

export const citySettleHandler = async (
  req: Request<CitySettleRequest>,
  res: Response<CitySettleResponse>,
  next: NextFunction
) => {
  try {
    const outpost_id = req.body.outpost_id
    if (!outpost_id) {
      return res.status(400).json({
        status: 'nok',
        error_code: 'outpost_id:not-found'
      })
    }

    const city_name = req.body.city_name
    if (!city_name) {
      return res.status(400).json({
        status: 'nok',
        error_code: 'city_name:not-found'
      })
    }

    const player_id = getPlayerIdFromContext(res)
    const { city_id } = await new CitySettleCommand().run({
      outpost_id,
      player_id,
      city_name
    })

    return res.json({
      status: 'ok',
      data: { city_id }
    })
  } catch (err) {
    next(err)
  }
}
