import {
  NextFunction,
  Request,
  Response
} from 'express'
import {
  BuildingGetRequest,
  BuildingGetDataResponse,
  BuildingGetResponse
} from '#client/src/endpoints/building/get'
import { getPlayerIdFromContext } from '#web/helpers'
import {
  BuildingGetQuery,
  BuildingGetQueryResponse
} from '#app/query/building/get'

export const buildingGetHandler = async (
  req: Request<BuildingGetRequest>,
  res: Response<BuildingGetResponse>,
  next: NextFunction
) => {
  const city_id = req.params.city_id
  if (!city_id) {
    return res.status(400).json({
      status: 'nok',
      error_code: 'city_id:not-found'
    })
  }

  const building_code = req.params.building_code
  if (!building_code) {
    return res.status(400).json({
      status: 'nok',
      error_code: 'building_code:not-found'
    })
  }

  try {
    const player_id = getPlayerIdFromContext(res)
    const result = await new BuildingGetQuery().run({
      city_id,
      building_code,
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
  building,
  cost,
  requirement,
  metadata
}: BuildingGetQueryResponse): BuildingGetDataResponse => {
  return {
    code: building.code,
    level: building.level,
    upgrade_at: building.upgrade_at ?? undefined,
    upgrade_cost: {
      plastic: cost.resource.plastic,
      mushroom: cost.resource.mushroom,
      duration: cost.duration
    },
    requirement: {
      buildings: requirement.buildings,
      technologies: requirement.technologies
    },
    metadata
  }
}
