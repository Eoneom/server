import {
  NextFunction, Request, Response 
} from 'express'
import {
  TechnologyResearchRequest, TechnologyResearchResponse 
} from '#client/src/endpoints/technology/research'
import { App } from '#app'
import { getPlayerIdFromContext } from '#web/helpers'

export const technologyResearchHandler = (app: App) => async (
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
    await app.commands.researchTechnology({
      city_id,
      technology_code,
      player_id 
    })
    return res.status(200).send({ status: 'ok' })
  } catch (err) {
    next(err)
  }
}
