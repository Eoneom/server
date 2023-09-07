import {
  NextFunction, Request, Response
} from 'express'
import {
  TroupCancelRequest, TroupCancelResponse
} from '#client/src/endpoints/troup/cancel'
import { getPlayerIdFromContext } from '#web/helpers'
import { TroupCancelCommand } from '#app/command/troup/cancel'

export const troupCancelHandler = async (
  req: Request<TroupCancelRequest>,
  res: Response<TroupCancelResponse>,
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
    const command = new TroupCancelCommand()
    await command.run({
      player_id,
      city_id,
    })

    const response: TroupCancelResponse = { status: 'ok' }
    return res.json(response)
  } catch (err) {
    next(err)
  }
}
