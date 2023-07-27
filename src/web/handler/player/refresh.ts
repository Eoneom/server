import {
  NextFunction,
  Request,
  Response
} from 'express'
import { RefreshResponse } from '#client/src/endpoints/player/refresh'
import { getPlayerIdFromContext } from '#web/helpers'
import { RefreshCommand } from '#app/command/refresh'


export const refreshHandler = async (
  req: Request<void>,
  res: Response<RefreshResponse>,
  next: NextFunction
) => {
  try {
    const player_id = getPlayerIdFromContext(res)

    const command = new RefreshCommand()
    await command.run({ player_id })

    return res.status(200).send({ status: 'ok' })
  } catch (err) {
    next(err)
  }
}
