import {
  NextFunction,
  Request,
  Response
} from 'express'
import {
  OutpostListDataResponse,
  OutpostListResponse
} from '#client/src/endpoints/outpost/list'
import { getPlayerIdFromContext } from '#web/helpers'
import {
  OutpostListQuery,
  OutpostListQueryResponse
} from '#app/query/outpost/list'

export const outpostListHandler = async (
  req: Request,
  res: Response<OutpostListResponse>,
  next: NextFunction
) => {
  try {
    const player_id = getPlayerIdFromContext(res)
    const result = await new OutpostListQuery().get({ player_id })
    const response = response_mapper(result)

    return res.json({
      status: 'ok',
      data: response
    })
  } catch (err) {
    next(err)
  }
}

const response_mapper = ({ outposts }: OutpostListQueryResponse): OutpostListDataResponse => {
  const outposts_response: OutpostListDataResponse['outposts'] = outposts.map(outpost => {
    return {
      id: outpost.id,
      coordinates: outpost.coordinates,
      type: outpost.type
    }
  })

  return { outposts: outposts_response }
}
