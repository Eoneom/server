import {
  NextFunction,
  Request,
  Response
} from 'express'
import { TroopFinishMovementResponse } from '@eoneom/api-client/src/endpoints/troop/movement/finish'
import { getPlayerIdFromContext } from '#web/helpers'
import { sagaFinishMovement } from '#app/saga/finish/movement'

export const troopFinishMovementHandler = async (
  req: Request,
  res: Response<TroopFinishMovementResponse>,
  next: NextFunction
) => {
  try {
    const player_id = getPlayerIdFromContext(res)

    const { is_outpost_created } = await sagaFinishMovement({ player_id })

    const response: TroopFinishMovementResponse = {
      status: 'ok',
      data: { is_outpost_created }
    }

    return res.json(response)
  } catch (err) {
    next(err)
  }
}
