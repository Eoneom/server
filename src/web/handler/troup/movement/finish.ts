import {
  NextFunction,
  Request,
  Response
} from 'express'
import { TroupFinishMovementResponse } from '#client/src/endpoints/troup/movement/finish'
import { getPlayerIdFromContext } from '#web/helpers'
import { sagaFinishMovement } from '#app/saga/finish-movement'

export const troupFinishMovementHandler = async (
  req: Request,
  res: Response<TroupFinishMovementResponse>,
  next: NextFunction
) => {
  try {
    const player_id = getPlayerIdFromContext(res)

    await sagaFinishMovement({ player_id })

    const response: TroupFinishMovementResponse = { status: 'ok' }

    return res.json(response)
  } catch (err) {
    next(err)
  }
}
