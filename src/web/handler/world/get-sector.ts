import {
  NextFunction, Request, Response
} from 'express'
import {
  WorldGetSectorDataResponse,
  WorldGetSectorRequest,
  WorldGetSectorResponse
} from '#client/src/endpoints/world/get-sector'
import {
  WorldGetSectorQuery, WorldGetSectorQueryResponse
} from '#app/query/world/get-sector'
import { getPlayerIdFromContext } from '#web/helpers'
import { CellEntity } from '#core/world/cell.entity'

export const worldGetSectorHandler = async (
  req: Request<WorldGetSectorRequest>,
  res: Response<WorldGetSectorResponse>,
  next: NextFunction
) => {
  const sector = req.params.sector
  if (!sector) {
    return res.status(400).json({
      status: 'nok',
      error_code: 'sector:not-found'
    })
  }

  try {
    const player_id = getPlayerIdFromContext(res)
    const query = new WorldGetSectorQuery()
    const {
      cells,
      explored_cell_ids
    } = await query.get({
      player_id,
      sector: Number.parseInt(`${sector}`)
    })

    const response = response_mapper({
      cells,
      explored_cell_ids
    })

    return res.json({
      status: 'ok',
      data: response
    })
  } catch (err) {
    next(err)
  }
}

const response_mapper = ({
  cells,
  explored_cell_ids
}: WorldGetSectorQueryResponse): WorldGetSectorDataResponse => {

  return {
    cells: cells.map(cell => cell_mapper({
      cell,
      explored_cell_ids
    }))
  }
}

const cell_mapper = ({
  cell,
  explored_cell_ids
}: {
  cell: CellEntity,
  explored_cell_ids: string[]
}): WorldGetSectorDataResponse['cells'][number] => {
  const is_explored = explored_cell_ids.some((explored_cell_id) => explored_cell_id === cell.id)
  const characteristic: WorldGetSectorDataResponse['cells'][number]['characteristic'] = is_explored ? {
    type: cell.type,
    resource_coefficient: {
      plastic: cell.resource_coefficient.plastic,
      mushroom: cell.resource_coefficient.mushroom
    }
  } : undefined

  return {
    coordinates: {
      x: cell.coordinates.x,
      y: cell.coordinates.y
    },
    characteristic
  }
}
