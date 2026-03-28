import {
  NextFunction, Request, Response
} from 'express'
import { TechnologyFinishResearchResponse } from '@eoneom/api-client/src/endpoints/technology/finish-research'
import { getPlayerIdFromContext } from '#web/helpers'
import { finishTechnologyResearch } from '#app/command/technology/finish-research'

export const technologyFinishResearchHandler = async (
  req: Request,
  res: Response<TechnologyFinishResearchResponse>,
  next: NextFunction
) => {
  try {
    const player_id = getPlayerIdFromContext(res)
    await finishTechnologyResearch({ player_id })

    return res.json({ status: 'ok' })
  } catch (err) {
    next(err)
  }
}
