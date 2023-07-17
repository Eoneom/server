import { NextFunction, Request, Response } from 'express'
import { App } from '../../../app'
import { TechnologyResearchRequest, TechnologyResearchResponse } from '../../../../client/src/endpoints/technology/research'

export const technology_research_handler = (app: App) => async (
  req: Request<TechnologyResearchRequest>,
  res: Response<TechnologyResearchResponse>,
  next: NextFunction
) => {
  // TODO: take player id from authentication
  const player_id = req.body.player_id
  if (!player_id) {
    return res.status(401).json({ status: 'nok', error_code: 'player_id:not-found'})
  }

  const city_id = req.body.city_id
  if (!city_id) {
    return res.status(400).json({ status: 'nok', error_code: 'city_id:not-found'})
  }

  const technology_code = req.body.technology_code
  if (!technology_code) {
    return res.status(400).json({ status: 'nok', error_code: 'technology_code:not-found'})
  }

  try {
    await app.commands.researchTechnology({ city_id, technology_code, player_id })
    return res.status(200).send({ status: 'ok' })
  } catch (err) {
    next(err)
  }
}
