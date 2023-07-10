import { NextFunction, Request, Response } from 'express'
import { App } from '../../app'
import { GenericResponse } from '../responses'

interface BuildingUpgradeRequest {
  player_id: string
  city_id: string
}

type BuildingUpgradeResponse = GenericResponse<undefined>

export const building_upgrade_handler = (app: App) => async (req: Request<BuildingUpgradeRequest>, res: Response<BuildingUpgradeResponse>, next: NextFunction) => {
  // TODO: take player id from authentication
  const player_id = req.body.player_id
  if (!player_id) {
    return res.status(401).json({ status: 'nok', error_code: 'player_id:not-found'})
  }

  const city_id = req.body.city_id
  if (!city_id) {
    return res.status(400).json({ status: 'nok', error_code: 'city_id:not-found'})
  }

  const building_code = req.body.building_code
  if (!building_code) {
    return res.status(400).json({ status: 'nok', error_code: 'building_code:not-found'})
  }

  try {
    await app.commands.upgradeBuilding({ city_id, building_code, player_id })
    return res.status(200).send({ status: 'ok' })
  } catch (err) {
    next(err)
  }
}
