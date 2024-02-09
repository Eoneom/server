import {
  NextFunction,
  Request,
  Response
} from 'express'
import { getPlayerIdFromContext } from '#web/helpers'
import {
  TroupMovementCreateRequest,
  TroupMovementCreateResponse
} from '#client/src/endpoints/troup/movement/create'
import { TroupCreateMovementCommand } from '#app/command/troup/movement/create'

export const troupCreateMovementHandler = async (
  req: Request<TroupMovementCreateRequest>,
  res: Response<TroupMovementCreateResponse>,
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

  const action = req.body.action
  if (!action) {
    return res.status(400).json({
      status: 'nok',
      error_code: 'action:not-found'
    })
  }

  try {
    const player_id = getPlayerIdFromContext(res)
    const { deleted_outpost_id } = await new TroupCreateMovementCommand().run({
      player_id,
      action,
      origin,
      destination,
      move_troups: troups
    })
    const response: TroupMovementCreateResponse = {
      status: 'ok',
      data: { deleted_outpost_id }
    }

    return res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}
