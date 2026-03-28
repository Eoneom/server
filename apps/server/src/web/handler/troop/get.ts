import {
  NextFunction,
  Request,
  Response
} from 'express'
import {
  TroopGetRequest,
  TroopGetResponse
} from '@eoneom/api-client/src/endpoints/troop/get'
import { getPlayerIdFromContext } from '#web/helpers'
import { TroopGetQuery } from '#query/troop/get'

export const troopGetHandler = async (
  req: Request<TroopGetRequest>,
  res: Response<TroopGetResponse>,
  next: NextFunction
) => {
  const troop_id = req.params.troop_id
  if (!troop_id) {
    return res.status(400).json({
      status: 'nok',
      error_code: 'troop_id:not-found'
    })
  }

  try {
    const player_id = getPlayerIdFromContext(res)
    const {
      troop,
      cost,
      requirement
    } = await new TroopGetQuery().run({
      player_id,
      troop_id
    })

    const data = {
      id: troop.id,
      code: troop.code,
      count: troop.count,
      ongoing_recruitment: troop.ongoing_recruitment ? {
        finish_at: troop.ongoing_recruitment.finish_at,
        remaining_count: troop.ongoing_recruitment.remaining_count
      } : undefined,
      cost: {
        plastic: cost.resource.plastic,
        mushroom: cost.resource.mushroom,
        duration: cost.duration
      },
      requirement
    }

    const response: TroopGetResponse = {
      status: 'ok',
      data
    }

    return res.json(response)
  } catch (err) {
    next(err)
  }
}
