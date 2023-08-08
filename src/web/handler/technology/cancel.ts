import {
  NextFunction, Request, Response
} from 'express'
import { TechnologyCancelResponse } from '#client/src/endpoints/technology/cancel'
import { getPlayerIdFromContext } from '#web/helpers'
import { CancelTechnologyCommand } from '#app/command/cancel-technology'

export const technologyCancelHandler = async (
  req: Request,
  res: Response<TechnologyCancelResponse>,
  next: NextFunction
) => {
  try {
    const player_id = getPlayerIdFromContext(res)
    const command = new CancelTechnologyCommand()
    await command.run({ player_id })

    const response: TechnologyCancelResponse = { status: 'ok' }

    return res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}
