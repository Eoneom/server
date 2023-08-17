import {
  NextFunction, Request, Response
} from 'express'
import {
  WorldGetSectorDataResponse,
  WorldGetSectorRequest, WorldGetSectorResponse
} from '#client/src/endpoints/world/get-sector'
import {
  WorldGetSectorQuery, WorldGetSectorQueryResponse
} from '#app/query/world/get-sector'

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
    const query = new WorldGetSectorQuery()
    console.log(typeof sector)
    const { cells } = await query.get({ sector: Number.parseInt(`${sector}`) })

    const response = response_mapper({ cells })

    return res.json({
      status: 'ok',
      data: response
    })
  } catch (err) {
    next(err)
  }
}

const response_mapper = ({ cells }: WorldGetSectorQueryResponse): WorldGetSectorDataResponse => {
  return {
    cells: cells.map(cell => ({
      coordinates: {
        x: cell.coordinates.x,
        y: cell.coordinates.y,
      },
      type: cell.type
    }))
  }
}
