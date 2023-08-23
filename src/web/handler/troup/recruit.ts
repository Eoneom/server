import {
  NextFunction, Request, Response
} from 'express'
import {
  TroupRecruitRequest, TroupRecruitResponse
} from '#client/src/endpoints/troup/recruit'
import { getPlayerIdFromContext } from '#web/helpers'
import { TroupRecruitCommand } from '#app/command/troup/recruit'

export const troupRecruitHandler = async (
  req: Request<TroupRecruitRequest>,
  res: Response<TroupRecruitResponse>,
  next: NextFunction
) => {
  const city_id = req.body.city_id
  if (!city_id) {
    return res.status(400).json({
      status: 'nok',
      error_code: 'city_id:not-found'
    })
  }

  const count = req.body.count
  if (!count) {
    return res.status(400).json({
      status: 'nok',
      error_code: 'count:not-found'
    })
  }

  const troup_code = req.body.troup_code
  if (!troup_code) {
    return res.status(400).json({
      status: 'nok',
      error_code: 'troup_code:not-found'
    })
  }

  try {
    const player_id = getPlayerIdFromContext(res)
    const command = new TroupRecruitCommand()
    const { recruit_at } = await command.run({
      city_id,
      count,
      player_id,
      troup_code,
    })
    const response: TroupRecruitResponse = {
      status: 'ok',
      data: { recruit_at }
    }
    return res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}
