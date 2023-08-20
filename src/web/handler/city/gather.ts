import {
  NextFunction,
  Request,
  Response
} from 'express'
import {
  CityGatherRequest, CityGatherResponse
} from '#client/src/endpoints/city/gather'
import { getPlayerIdFromContext } from '#web/helpers'
import { CityGatherCommand } from '#app/command/city/gather'

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
    const command = new CityGatherCommand()
    const result = await command.run({
      player_id,
      city_id
    })

    return res.json({
      status: 'ok',
      data: result
    })
  } catch (err) {
    next(err)
  }
}
