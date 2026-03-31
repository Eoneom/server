import {
  NextFunction,
  Request,
  Response
} from 'express'
import {
  GameRefreshStateRequest, GameRefreshStateResponse
} from '@eoneom/api-client/src/endpoints/game/refresh-state'
import { getPlayerIdFromContext } from '#web/helpers'
import { sagaRefreshGameState } from '#app/saga/game/refresh-state'

export const gameRefreshStateHandler = async (
  req: Request<GameRefreshStateRequest>,
  res: Response<GameRefreshStateResponse>,
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
    void sagaRefreshGameState({
      city_id,
      player_id
    })

    return res.json({ status: 'ok' })
  } catch (err) {
    next(err)
  }
}
