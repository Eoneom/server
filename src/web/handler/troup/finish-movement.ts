import {
  NextFunction, Request, Response
} from 'express'
import {
  TroupFinishMovementRequest, TroupFinishMovementResponse
} from '#client/src/endpoints/troup/finish-movement'
import { getPlayerIdFromContext } from '#web/helpers'
import { TroupFinishExploreCommand } from '#app/command/troup/finish/explore'
import { TroupGetMovementActionQuery } from '#app/query/troup/get-movement-action'
import { MovementAction } from '#core/troup/constant/movement-action'
import { TroupError } from '#core/troup/error'
import { TroupFinishMovementCommand } from '#app/command/troup/finish'
import { TroupFinishBaseCommand } from '#app/command/troup/finish/base'

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
    const get_movement_action_query = new TroupGetMovementActionQuery()
    const { action } = await get_movement_action_query.get({ movement_id })
    let command: TroupFinishMovementCommand

    switch (action) {
    case MovementAction.EXPLORE:
      command = new TroupFinishExploreCommand()
      break
    case MovementAction.BASE:
      command = new TroupFinishBaseCommand()
      break
    default:
      throw new Error(TroupError.MOVEMENT_ACTION_NOT_IMPLEMENTED)
    }

    await command.run({
      player_id,
      movement_id,
    })

    const response: TroupFinishMovementResponse = { status: 'ok' }

    return res.json(response)
  } catch (err) {
    next(err)
  }
}
