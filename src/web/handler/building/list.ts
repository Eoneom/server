import {
  NextFunction,
  Request,
  Response
} from 'express'
import {
  BuildingListResponse,
  BuildingListDataResponse
} from '#client/src/endpoints/building/list'
import { getPlayerIdFromContext } from '#web/helpers'
import {
  BuildingListQuery,
  ListBuildingQueryResponse
} from '#query/building/list'

export const buildingListHandler = async (
  req: Request,
  res: Response<BuildingListResponse>,
  next: NextFunction
) => {
  const city_id = req.params.city_id
  if (!city_id) {
    return res.status(400).json({
      status: 'nok',
      error_code: 'city_id:not-found'
    })
  }

  try {
    const player_id = getPlayerIdFromContext(res)
    const result = await new BuildingListQuery().get({
      city_id,
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

const response_mapper = ({ buildings }: ListBuildingQueryResponse): BuildingListDataResponse => {
  const response_buildings: BuildingListDataResponse['buildings'] = buildings.map(building => {
    return {
      id: building.id,
      code: building.code,
      level: building.level,
      upgrade_at: building.upgrade_at ?? undefined,
    }
  })

  return { buildings: response_buildings }
}
