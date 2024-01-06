import {
  NextFunction,
  Request,
  Response
} from 'express'
import {
  TroupBaseRequest,
  TroupBaseResponse
} from '#client/src/endpoints/troup/base'
import { getPlayerIdFromContext } from '#web/helpers'
import { TroupBaseCommand } from '#app/command/troup/movement/base'

export const troupBaseHandler = async (
  req: Request<TroupBaseRequest>,
  res: Response<TroupBaseResponse>,
  next: NextFunction
) => {
  const origin = req.body.origin
  if (!origin) {
    return res.status(400).json({
      status: 'nok',
      error_code: 'origin:not-found'
    })
  }

  const destination = req.body.destination
  if (!destination) {
    return res.status(400).json({
      status: 'nok',
      error_code: 'destination:not-found'
    })
  }

  const troups = req.body.troups
  if (!troups) {
    return res.status(400).json({
      status: 'nok',
      error_code: 'troups:not-found'
    })
  }

  try {
    const player_id = getPlayerIdFromContext(res)
    await new TroupBaseCommand().run({
      player_id,
      origin,
      destination,
      troups_to_move: troups
    })
    const response: TroupBaseResponse = { status: 'ok' }

    return res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}
