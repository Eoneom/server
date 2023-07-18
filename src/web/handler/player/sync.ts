import { NextFunction, Request, Response } from 'express'
import { SyncResponse, SyncDataResponse } from '#client/src/endpoints/player/sync'
import { App } from '#app'
import { PlayerEntity } from '#core/player/domain/entity'
import { BuildingEntity } from '#core/building/domain/entity'
import { CityEntity } from '#core/city/domain/entity'
import { TechnologyEntity } from '#core/technology/domain/entity'
import { getPlayerIdFromContext } from '#web/helpers'

export const syncHandler = (app: App) => async (
  req: Request<void>,
  res: Response<SyncResponse>,
  next: NextFunction
) => {
  try {
    const player_id = getPlayerIdFromContext(res)
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
        level: building.level,
        upgrade_at: building.upgrade_at ?? undefined
      }))
    })),
    technologies: technologies.map(technology => ({
      id: technology.id,
      code: technology.code,
      level: technology.level,
      research_at: technology.research_at ?? undefined
    }))
  }
}
