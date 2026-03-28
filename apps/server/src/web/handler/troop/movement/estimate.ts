import {
  NextFunction,
  Request,
  Response
} from 'express'
import {
  TroopMovementEstimateRequest,
  TroopMovementEstimateResponse
} from '@eoneom/api-client/src/endpoints/troop/movement/estimate'
import { TroopMovementEstimateQuery } from '#query/troop/movement/estimate'

export const troopEstimateMovementHandler = async (
  req: Request<TroopMovementEstimateRequest>,
  res: Response<TroopMovementEstimateResponse>,
  next: NextFunction
) => {
  const origin = req.body.origin
  if (!origin) {
    return res.status(400).json({
      status: 'nok',
      error_code: 'origin:not-found'
    })
  }

  const destination = req.body.destination
  if (!destination) {
    return res.status(400).json({
      status: 'nok',
      error_code: 'destination:not-found'
    })
  }

  const troop_codes = req.body.troop_codes
  if (!troop_codes) {
    return res.status(400).json({
      status: 'nok',
      error_code: 'troop_codes:not-found'
    })
  }

  try {
    const {
      distance,
      speed,
      duration
    } = await new TroopMovementEstimateQuery().run({
      origin,
      destination,
      troop_codes
    })

    const response: TroopMovementEstimateResponse = {
      status: 'ok',
      data: {
        distance,
        speed,
        duration
      }
    }

    return res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}
