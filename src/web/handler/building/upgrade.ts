import {
  NextFunction, Request, Response
} from 'express'
import {
  BuildingUpgradeRequest, BuildingUpgradeResponse
} from '#client/src/endpoints/building/upgrade'
import { getPlayerIdFromContext } from '#web/helpers'
import { UpgradeBuildingCommand } from '#app/command/upgrade-building'

export const buildingUpgradeHandler = async (
  req: Request<BuildingUpgradeRequest>,
  res: Response<BuildingUpgradeResponse>,
  next: NextFunction
) => {
  const city_id = req.body.city_id
  if (!city_id) {
    return res.status(400).json({
      status: 'nok',
      error_code: 'city_id:not-found'
    })
  }

  const building_code = req.body.building_code
  if (!building_code) {
    return res.status(400).json({
      status: 'nok',
      error_code: 'building_code:not-found'
    })
  }

  try {
    const player_id = getPlayerIdFromContext(res)
    const command = new UpgradeBuildingCommand()
    await command.run({
      player_id,
      city_id,
      building_code
    })

    return res.status(200).send({ status: 'ok' })
  } catch (err) {
    next(err)
  }
}
