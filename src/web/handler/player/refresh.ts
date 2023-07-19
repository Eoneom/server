import {
  NextFunction,
  Request,
  Response
} from 'express'
import { RefreshResponse } from '#client/src/endpoints/player/refresh'
import { App } from '#app'
import { getPlayerIdFromContext } from '#web/helpers'


export const refreshHandler = (app: App) => async (
  req: Request<void>,
  res: Response<RefreshResponse>,
  next: NextFunction
) => {
  try {
    const player_id = getPlayerIdFromContext(res)

    await app.commands.refresh({ player_id })

    return res.status(200).send({ status: 'ok' })
  } catch (err) {
    next(err)
  }
}
