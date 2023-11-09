import {
  NextFunction, Request, Response
} from 'express'
import { TechnologyCancelResponse } from '#client/src/endpoints/technology/cancel'
import { getPlayerIdFromContext } from '#web/helpers'
import { TechnologyCancelCommand } from '#command/technology/cancel'

export const technologyCancelHandler = async (
  req: Request,
  res: Response<TechnologyCancelResponse>,
  next: NextFunction
) => {
  try {
    const player_id = getPlayerIdFromContext(res)
    await new TechnologyCancelCommand().run({ player_id })

    const response: TechnologyCancelResponse = { status: 'ok' }

    return res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}
