import {
  NextFunction, Request, Response
} from 'express'
import {
  BuildingFinishUpgradeRequest,
  BuildingFinishUpgradeResponse
} from '#client/src/endpoints/building/finish-upgrade'
import { getPlayerIdFromContext } from '#web/helpers'
import { sagaFinishUpgrade } from '#app/saga/finish/upgrade'

export const buildingFinishUpgradeHandler = async (
  req: Request<BuildingFinishUpgradeRequest>,
  res: Response<BuildingFinishUpgradeResponse>,
  next: NextFunction
) => {
  const city_id = req.body.city_id
  if (!city_id) {
    return res.status(400).json({
      status: 'nok',
      error_code: 'city_id:not-found'
    })
  }

  try {
    const player_id = getPlayerIdFromContext(res)
    await sagaFinishUpgrade({
      player_id,
      city_id
    })

    return res.json({ status: 'ok' })
  } catch (err) {
    next(err)
  }
}
