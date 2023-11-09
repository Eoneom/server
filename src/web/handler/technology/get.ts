import {
  NextFunction, Request, Response
} from 'express'
import {
  TechnologyGetDataResponse,
  TechnologyGetRequest,
  TechnologyGetResponse
} from '#client/src/endpoints/technology/get'
import { getPlayerIdFromContext } from '#web/helpers'
import {
  TechnologyGetQuery,
  TechnologyGetQueryResponse
} from '#app/query/technology/get'

export const technologyGetHandler = async (
  req: Request<TechnologyGetRequest>,
  res: Response<TechnologyGetResponse>,
  next: NextFunction
) => {
  const city_id = req.params.city_id
  if (!city_id) {
    return res.status(400).json({
      status: 'nok',
      error_code: 'city_id:not_found'
    })
  }
  const technology_code = req.params.technology_code
  if (!technology_code) {
    return res.status(400).json({
      status: 'nok',
      error_code: 'technology_code:not_found'
    })
  }

  try {
    const player_id = getPlayerIdFromContext(res)
    const result = await new TechnologyGetQuery().get({
      player_id,
      city_id,
      technology_code
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
  technology,
  cost,
  requirement
}: TechnologyGetQueryResponse): TechnologyGetDataResponse => {
  return {
    id: technology.id,
    code: technology.code,
    level: technology.level,
    research_at: technology.research_at ?? undefined,
    research_cost: {
      plastic: cost.resource.plastic,
      mushroom: cost.resource.mushroom,
      duration: cost.duration
    },
    requirement
  }
}
