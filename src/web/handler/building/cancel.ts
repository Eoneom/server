import {
  NextFunction, Request, Response
} from 'express'
import {
  BuildingCancelRequest, BuildingCancelResponse
} from '#client/src/endpoints/building/cancel'
import { getPlayerIdFromContext } from '#web/helpers'
import { CancelBuildingCommand } from '#app/command/cancel-building'

export const buildingCancelHandler = async (
  req: Request<BuildingCancelRequest>,
  res: Response<BuildingCancelResponse>,
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
    const command = new CancelBuildingCommand()
    await command.run({
      player_id,
      city_id,
    })

    const response: BuildingCancelResponse = { status: 'ok' }
    return res.json(response)
  } catch (err) {
    next(err)
  }
}
