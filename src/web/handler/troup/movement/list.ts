import {
  NextFunction, Request, Response
} from 'express'
import {
  TroupListMovementResponse,
  TroupListMovementDataResponse
} from '#client/src/endpoints/troup/movement/list'
import { getPlayerIdFromContext } from '#web/helpers'
import {
  TroupMovementListQuery,
  TroupMovementListQueryResponse
} from '#app/query/troup/movement/list'

export const troupListMovementHandler = async (
  req: Request,
  res: Response<TroupListMovementResponse>,
  next: NextFunction
) => {
  try {
    const player_id = getPlayerIdFromContext(res)
    const result = await new TroupMovementListQuery().run({ player_id })
    const response = response_mapper(result)

    return res.json({
      status: 'ok',
      data: response
    })
  } catch (err) {
    next(err)
  }
}

const response_mapper = ({ movements }: TroupMovementListQueryResponse): TroupListMovementDataResponse => {
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
