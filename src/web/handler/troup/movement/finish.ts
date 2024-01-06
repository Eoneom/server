import {
  NextFunction, Request, Response
} from 'express'
import {
  TroupFinishMovementRequest, TroupFinishMovementResponse
} from '#client/src/endpoints/troup/movement/finish'
import { getPlayerIdFromContext } from '#web/helpers'
import { TroupFinishExploreCommand } from '#app/command/troup/movement/finish/explore'
import { TroupGetMovementActionQuery } from '#app/query/troup/get-movement-action'
import { MovementAction } from '#core/troup/constant/movement-action'
import { TroupError } from '#core/troup/error'
import { sagaFinishBase } from '#app/saga/finish-base'

export const troupFinishMovementHandler = async (
  req: Request<TroupFinishMovementRequest>,
  res: Response<TroupFinishMovementResponse>,
  next: NextFunction
) => {
  const movement_id = req.params.movement_id
  if (!movement_id) {
    return res.status(400).json({
      status: 'nok',
      error_code: 'movement_id:not-found'
    })
  }

  try {
    const player_id = getPlayerIdFromContext(res)
    const { action } = await new TroupGetMovementActionQuery().run({ movement_id })

    switch (action) {
    case MovementAction.EXPLORE:
      await new TroupFinishExploreCommand().run({
        player_id,
        movement_id
      })
      break
    case MovementAction.BASE:
      await sagaFinishBase({
        player_id,
        movement_id
      })
      break
    default:
      throw new Error(TroupError.MOVEMENT_ACTION_NOT_IMPLEMENTED)
    }

    const response: TroupFinishMovementResponse = { status: 'ok' }

    return res.json(response)
  } catch (err) {
    next(err)
  }
}
