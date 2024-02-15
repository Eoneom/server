import {
  NextFunction,
  Request,
  Response
} from 'express'
import {
  TroupGetRequest,
  TroupGetResponse
} from '#client/src/endpoints/troup/get'
import { getPlayerIdFromContext } from '#web/helpers'
import { TroupGetQuery } from '#app/query/troup/get'

export const troupGetHandler = async (
  req: Request<TroupGetRequest>,
  res: Response<TroupGetResponse>,
  next: NextFunction
) => {
  const troup_id = req.params.troup_id
  if (!troup_id) {
    return res.status(400).json({
      status: 'nok',
      error_code: 'troup_id:not-found'
    })
  }

  try {
    const player_id = getPlayerIdFromContext(res)
    const {
      troup,
      cost,
      requirement
    } = await new TroupGetQuery().run({
      player_id,
      troup_id
    })

    const data = {
      id: troup.id,
      code: troup.code,
      count: troup.count,
      ongoing_recruitment: troup.ongoing_recruitment ? {
        finish_at: troup.ongoing_recruitment.finish_at,
        remaining_count: troup.ongoing_recruitment.remaining_count
      } : undefined,
      cost: {
        plastic: cost.resource.plastic,
        mushroom: cost.resource.mushroom,
        duration: cost.duration
      },
      requirement
    }

    const response: TroupGetResponse = {
      status: 'ok',
      data
    }

    return res.json(response)
  } catch (err) {
    next(err)
  }
}
