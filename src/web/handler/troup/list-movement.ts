import {
  NextFunction, Request, Response
} from 'express'
import {
  TroupListMovementResponse,
  TroupListMovementDataResponse
} from '#client/src/endpoints/troup/list-movement'
import { getPlayerIdFromContext } from '#web/helpers'
import {
  TroupListMovementQuery,
  TroupListMovementQueryResponse
} from '#query/troup/list-movement'

export const troupListMovementHandler = async (
  req: Request,
  res: Response<TroupListMovementResponse>,
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
    const result = await new TroupListMovementQuery().run({
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

const response_mapper = ({ movements }: TroupListMovementQueryResponse): TroupListMovementDataResponse => {
  const response_movements: TroupListMovementDataResponse['movements'] = movements.map(movement => {
    return {
      id: movement.id,
      action: movement.action,
      origin: {
        sector: movement.origin.sector,
        x: movement.origin.x,
        y: movement.origin.y
      },
      destination: {
        sector: movement.destination.sector,
        x: movement.destination.x,
        y: movement.destination.y
      },
      arrive_at: movement.arrive_at
    }
  })

  return { movements: response_movements }
}
