import {
  NextFunction, Request, Response
} from 'express'
import {
  TroopProgressRecruitRequest,
  TroopProgressRecruitResponse
} from '@eoneom/api-client/src/endpoints/troop/progress-recruit'
import { getPlayerIdFromContext } from '#web/helpers'
import { progressTroopRecruitment } from '#app/command/troop/progress-recruit'

export const troopProgressRecruitHandler = async (
  req: Request<TroopProgressRecruitRequest>,
  res: Response<TroopProgressRecruitResponse>,
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
    const { recruit_count } = await progressTroopRecruitment({
      city_id,
      player_id,
    })

    const response: TroopProgressRecruitResponse = {
      status: 'ok',
      data: { recruit_count }
    }
    return res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}
