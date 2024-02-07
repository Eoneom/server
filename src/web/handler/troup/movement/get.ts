import {
  NextFunction, Request, Response
} from 'express'
import {
  TroupGetMovementResponse,
  TroupGetMovementDataResponse
} from '#client/src/endpoints/troup/movement/get'
import { getPlayerIdFromContext } from '#web/helpers'
import {
  TroupMovementGetQuery,
  TroupMovementGetQueryResponse
} from '#app/query/troup/movement/get'

export const troupGetMovementHandler = async (
  req: Request,
  res: Response<TroupGetMovementResponse>,
  next: NextFunction
) => {
  const movement_id = req.params.movement_id
  if (!movement_id) {
    return res.status(400).json({
      status: 'nok',
      error_code: 'movement_id:not-found'
    })
  }

  try {
    const player_id = getPlayerIdFromContext(res)
    const result = await new TroupMovementGetQuery().run({
      player_id,
      movement_id
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
  movement,
  troups
}: TroupMovementGetQueryResponse): TroupGetMovementDataResponse => {
  const response_movements: TroupGetMovementDataResponse = {
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
    arrive_at: movement.arrive_at,
    troups: troups.map((troup) => ({
      code: troup.code,
      count: troup.count
    }))
  }

  return response_movements
}
