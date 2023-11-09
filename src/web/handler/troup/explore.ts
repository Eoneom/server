import {
  NextFunction,
  Request,
  Response
} from 'express'
import {
  TroupExploreRequest,
  TroupExploreResponse
} from '#client/src/endpoints/troup/explore'
import { getPlayerIdFromContext } from '#web/helpers'
import { TroupExploreCommand } from '#app/command/troup/explore'

export const troupExploreHandler = async (
  req: Request<TroupExploreRequest>,
  res: Response<TroupExploreResponse>,
  next: NextFunction
) => {
  const city_id = req.body.city_id
  if (!city_id) {
    return res.status(400).json({
      status: 'nok',
      error_code: 'city_id:not-found'
    })
  }

  const coordinates = req.body.coordinates
  if (!coordinates) {
    return res.status(400).json({
      status: 'nok',
      error_code: 'coordinates:not-found'
    })
  }

  try {
    const player_id = getPlayerIdFromContext(res)
    await new TroupExploreCommand().run({
      city_id,
      player_id,
      coordinates
    })
    const response: TroupExploreResponse = { status: 'ok' }

    return res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}
