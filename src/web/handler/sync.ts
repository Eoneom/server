import { NextFunction, Request, Response } from 'express'
import { App } from '../../app'
import { GenericResponse } from '../responses'
import { PlayerEntity } from '../../core/player/domain/entity'
import { BuildingEntity } from '../../core/building/domain/entity'
import { CityEntity } from '../../core/city/domain/entity'
import { TechnologyEntity } from '../../core/technology/domain/entity'

interface SyncRequest {
  player_id: string
}

interface SyncDataResponse {
  player: {
    name: string
  }
  cities: {
    name: string
    plastic: number
    mushroom: number
    buildings: {
      code: string
      level: number
    }[]
  }[]
  technologies: {
    code: string
    level: number
  }[]
}

type SyncResponse = GenericResponse<SyncDataResponse>

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
      name: player.name,
    },
    cities: cities.map(city => ({
      name: city.name,
      plastic: city.plastic,
      mushroom: city.mushroom,
      buildings: buildings[city.id].map(building => ({
        code: building.code,
        level: building.level
      }))
    })),
    technologies: technologies.map(technology => ({
      code: technology.code,
      level: technology.level
    }))
  }
}

export const sync_handler = (app: App) => async (req: Request<SyncRequest>, res: Response<SyncResponse>, next: NextFunction) => {
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
