import {
  NextFunction, Request, Response
} from 'express'
import {
  BuildingListResponse, BuildingListDataResponse
} from '#client/src/endpoints/building/list'
import {
  ListBuildingQueryResponse, Queries
} from '#app/queries'
import { getPlayerIdFromContext } from '#web/helpers'

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
    const result = await Queries.listBuildings({
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

const response_mapper = ({
  buildings, costs
}: ListBuildingQueryResponse): BuildingListDataResponse => {
  const response_buildings: BuildingListDataResponse['buildings'] = buildings.map(building => {
    const cost = costs[building.id]
    return {
      id: building.id,
      city_id: building.city_id,
      code: building.code,
      name: building.name,
      level: building.level,
      upgrade_at: building.upgrade_at ?? undefined,
      upgrade_cost: {
        plastic: cost.resource.plastic,
        mushroom: cost.resource.mushroom,
        duration: cost.duration
      }
    }
  })

  return { buildings: response_buildings }
}
