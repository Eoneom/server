import {
  NextFunction, Request, Response
} from 'express'
import { SyncResponse } from '#client/src/endpoints/player/sync'
import { getPlayerIdFromContext } from '#web/helpers'
import { RefreshCommand } from '#command/refresh'

export const syncHandler = async (
  req: Request<void>,
  res: Response<SyncResponse>,
  next: NextFunction
) => {
  try {
    const player_id = getPlayerIdFromContext(res)

    const command = new RefreshCommand()
    await command.run({ player_id })

    return res.json({ status: 'ok' })
  } catch (err) {
    next(err)
  }
}
