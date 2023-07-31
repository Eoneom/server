import {
  NextFunction, Request, Response
} from 'express'
import {
  TechnologyListDataResponse, TechnologyListResponse
} from '#client/src/endpoints/technology/list'
import {
  ListTechnologyQueryResponse, Queries
} from '#app/queries'
import { getPlayerIdFromContext } from '#web/helpers'

export const technologyListHandler = async (
  req: Request,
  res: Response<TechnologyListResponse>,
  next: NextFunction
) => {
  try {
    const player_id = getPlayerIdFromContext(res)
    const result = await Queries.listTechnologies({ player_id })
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
  technologies, costs
}: ListTechnologyQueryResponse): TechnologyListDataResponse => {
  const response_technologies: TechnologyListDataResponse['technologies'] = technologies.map(technology => {
    const cost = costs[technology.id]
    return {
      id: technology.id,
      code: technology.code,
      level: technology.level,
      research_at: technology.research_at ?? undefined,
      research_cost: {
        plastic: cost.resource.plastic,
        mushroom: cost.resource.mushroom,
        duration: cost.duration
      }
    }
  })

  return { technologies: response_technologies }
}
