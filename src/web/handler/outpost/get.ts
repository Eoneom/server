import {
  NextFunction,
  Request,
  Response
} from 'express'
import {
  OutpostGetDataResponse,
  OutpostGetRequest,
  OutpostGetResponse
} from '#client/src/endpoints/outpost/get'
import { getPlayerIdFromContext } from '#web/helpers'
import {
  OutpostGetQuery,
  OutpostGetQueryResponse
} from '#app/query/outpost/get'

export const outpostGetHandler = async (
  req: Request<OutpostGetRequest>,
  res: Response<OutpostGetResponse>,
  next: NextFunction
) => {
  const outpost_id = req.params.outpost_id
  if (!outpost_id) {
    return res.status(400).json({
      status: 'nok',
      error_code: 'outpost_id:not-found'
    })
  }

  try {
    const player_id = getPlayerIdFromContext(res)
    const result = await new OutpostGetQuery().run({
      outpost_id,
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
  outpost,
  cell
}: OutpostGetQueryResponse): OutpostGetDataResponse => {
  return {
    id: outpost.id,
    coordinates: cell.coordinates,
    type: outpost.type
  }
}
