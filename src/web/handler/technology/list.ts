import {
  NextFunction, Request, Response
} from 'express'
import {
  TechnologyListDataResponse, TechnologyListRequest, TechnologyListResponse
} from '#client/src/endpoints/technology/list'
import { getPlayerIdFromContext } from '#web/helpers'
import {
  TechnologyListQuery, TechnologyListQueryResponse
} from '#query/technology/list'

export const technologyListHandler = async (
  req: Request<TechnologyListRequest>,
  res: Response<TechnologyListResponse>,
  next: NextFunction
) => {
  const city_id = req.params.city_id
  if (!city_id) {
    return res.status(400).json({
      status: 'nok',
      error_code: 'city_id:not_found'
    })
  }
  try {
    const player_id = getPlayerIdFromContext(res)
    const query = new TechnologyListQuery()
    const result = await query.get({
      player_id,
      city_id
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
  technologies,
  costs,
  requirements
}: TechnologyListQueryResponse): TechnologyListDataResponse => {
  const response_technologies: TechnologyListDataResponse['technologies'] = technologies.map(technology => {
    const cost = costs[technology.id]
    const requirement = requirements[technology.code]
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
      requirements: requirement
    }
  })

  return { technologies: response_technologies }
}
