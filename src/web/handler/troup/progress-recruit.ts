import {
  NextFunction, Request, Response
} from 'express'
import {
  TroupProgressRecruitRequest,
  TroupProgressRecruitResponse
} from '#client/src/endpoints/troup/progress-recruit'
import { getPlayerIdFromContext } from '#web/helpers'
import { TroupProgressRecruitCommand } from '#app/command/troup/progress-recruit'

export const troupProgressRecruitHandler = async (
  req: Request<TroupProgressRecruitRequest>,
  res: Response<TroupProgressRecruitResponse>,
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
    const { recruit_count } = await new TroupProgressRecruitCommand().run({
      city_id,
      player_id,
    })

    const response: TroupProgressRecruitResponse = {
      status: 'ok',
      data: { recruit_count }
    }
    return res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}
