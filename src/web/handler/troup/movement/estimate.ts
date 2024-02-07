import {
  NextFunction,
  Request,
  Response
} from 'express'
import {
  TroupMovementEstimateRequest,
  TroupMovementEstimateResponse
} from '#client/src/endpoints/troup/movement/estimate'
import { TroupMovementEstimateQuery } from '#app/query/troup/movement/estimate'

export const troupEstimateMovementHandler = async (
  req: Request<TroupMovementEstimateRequest>,
  res: Response<TroupMovementEstimateResponse>,
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

  const troup_codes = req.body.troup_codes
  if (!troup_codes) {
    return res.status(400).json({
      status: 'nok',
      error_code: 'troup_codes:not-found'
    })
  }

  try {
    const {
      distance,
      speed,
      duration
    } = await new TroupMovementEstimateQuery().run({
      origin,
      destination,
      troup_codes
    })

    const response: TroupMovementEstimateResponse = {
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
