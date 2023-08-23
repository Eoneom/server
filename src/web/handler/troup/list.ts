import {
  NextFunction, Request, Response
} from 'express'
import {
  TroupListResponse, TroupListDataResponse
} from '#client/src/endpoints/Troup/list'
import { getPlayerIdFromContext } from '#web/helpers'
import {
  TroupListQuery,
  TroupListQueryResponse
} from '#query/troup/list'

export const troupListHandler = async (
  req: Request,
  res: Response<TroupListResponse>,
  next: NextFunction
) => {
  const city_id = req.params.city_id
  if (!city_id) {
    return res.status(400).json({
      status: 'nok',
      error_code: 'city_id:not-found'
    })
  }

  try {
    const player_id = getPlayerIdFromContext(res)
    const query = new TroupListQuery()
    const result = await query.get({
      city_id,
      player_id
    })
    const response = response_mapper(result)

    return res.json({
      status: 'ok',
      data: response
    })
  } catch (err) {
    next(err)
  }
}

const response_mapper = ({
  troups,
  costs
}: TroupListQueryResponse): TroupListDataResponse => {
  const response_troups: TroupListDataResponse['troups'] = troups.map(troup => {
    const cost = costs[troup.id]
    return {
      id: troup.id,
      city_id: troup.city_id,
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
      }
    }
  })

  return { troups: response_troups }
}
