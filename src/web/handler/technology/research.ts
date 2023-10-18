import {
  NextFunction, Request, Response
} from 'express'
import {
  TechnologyResearchRequest, TechnologyResearchResponse
} from '#client/src/endpoints/technology/research'
import { getPlayerIdFromContext } from '#web/helpers'
import { TechnologyResearchCommand } from '#command/technology/research'
import { sagaResearchTechnology } from '#app/saga/research-technology'

export const technologyResearchHandler = async (
  req: Request<TechnologyResearchRequest>,
  res: Response<TechnologyResearchResponse>,
  next: NextFunction
) => {
  const city_id = req.body.city_id
  if (!city_id) {
    return res.status(400).json({
      status: 'nok',
      error_code: 'city_id:not-found'
    })
  }

  const technology_code = req.body.technology_code
  if (!technology_code) {
    return res.status(400).json({
      status: 'nok',
      error_code: 'technology_code:not-found'
    })
  }

  try {
    const player_id = getPlayerIdFromContext(res)
    await sagaResearchTechnology({
      city_id,
      player_id,
      technology_code
    })
    const response: TechnologyResearchResponse = { status: 'ok' }
    return res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}
