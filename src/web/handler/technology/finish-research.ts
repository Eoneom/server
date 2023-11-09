import {
  NextFunction, Request, Response
} from 'express'
import { TechnologyFinishResearchResponse } from '#client/src/endpoints/technology/finish-research'
import { getPlayerIdFromContext } from '#web/helpers'
import { TechnologyFinishResearchCommand } from '#app/command/technology/finish-research'

export const technologyFinishResearchHandler = async (
  req: Request,
  res: Response<TechnologyFinishResearchResponse>,
  next: NextFunction
) => {
  try {
    const player_id = getPlayerIdFromContext(res)
    await new TechnologyFinishResearchCommand().run({ player_id })

    return res.json({ status: 'ok' })
  } catch (err) {
    next(err)
  }
}
