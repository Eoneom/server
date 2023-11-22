import {
  NextFunction, Request, Response
} from 'express'
import {
  TechnologyListDataResponse, TechnologyListResponse
} from '#client/src/endpoints/technology/list'
import { getPlayerIdFromContext } from '#web/helpers'
import {
  TechnologyListQuery, TechnologyListQueryResponse
} from '#query/technology/list'

export const technologyListHandler = async (
  req: Request<void>,
  res: Response<TechnologyListResponse>,
  next: NextFunction
) => {
  try {
    const player_id = getPlayerIdFromContext(res)
    const result = await new TechnologyListQuery().run({ player_id })
    const response = response_mapper(result)

    return res.json({
      status: 'ok',
      data: response
    })
  } catch (err) {
    next(err)
  }
}

const response_mapper = ({ technologies }: TechnologyListQueryResponse): TechnologyListDataResponse => {
  const response_technologies: TechnologyListDataResponse['technologies'] = technologies.map(technology => {
    return {
      id: technology.id,
      code: technology.code,
      level: technology.level,
      research_at: technology.research_at ?? undefined
    }
  })

  return { technologies: response_technologies }
}
