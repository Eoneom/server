import { NextFunction, Request, Response } from 'express'
import { App } from '../../../app'
import { PlayerEntity } from '../../../core/player/domain/entity'
import { BuildingEntity } from '../../../core/building/domain/entity'
import { CityEntity } from '../../../core/city/domain/entity'
import { TechnologyEntity } from '../../../core/technology/domain/entity'
import { SyncRequest, SyncResponse, SyncDataResponse } from '../../../../client/src/endpoints/player/sync'

export const sync_handler = (app: App) => async (
  req: Request<SyncRequest>,
  res: Response<SyncResponse>,
  next: NextFunction
) => {
  // TODO: take player id from authentication
  const player_id = req.body.player_id
  if (!player_id) {
    return res.status(401).json({ status: 'nok', error_code: 'player_id:not-found'})
  }

  try {
    const { player, buildings, cities, technologies } = await app.queries.sync({ player_id })

    const response = response_mapper({ player, buildings, cities, technologies })

    return res.json({
      status: 'ok',
      data: response
    })
  } catch (err) {
    next(err)
  }
}


const response_mapper = ({
  player,
  buildings,
  cities,
  technologies
}: {
  player: PlayerEntity
  buildings: Record<string, BuildingEntity[]>
  cities: CityEntity[]
  technologies: TechnologyEntity[]
}): SyncDataResponse => {
  return {
    player: {
      id: player.id,
      name: player.name,
    },
    cities: cities.map(city => ({
      id: city.id,
      name: city.name,
      plastic: city.plastic,
      mushroom: city.mushroom,
      buildings: buildings[city.id].map(building => ({
        id: building.id,
        code: building.code,
        level: building.level
      }))
    })),
    technologies: technologies.map(technology => ({
      id: technology.id,
      code: technology.code,
      level: technology.level
    }))
  }
}
