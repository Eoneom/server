import {
  NextFunction, Request, Response
} from 'express'
import {
  SyncResponse, SyncDataResponse
} from '#client/src/endpoints/player/sync'
import { PlayerEntity } from '#core/player/entity'
import { BuildingEntity } from '#core/building/entity'
import { CityEntity } from '#core/city/entity'
import { TechnologyEntity } from '#core/technology/entity'
import { getPlayerIdFromContext } from '#web/helpers'
import { Queries } from '#app/queries'
import { Factory } from '#app/factory'
import { RefreshCommand } from '#app/command/refresh'

export const syncHandler = async (
  req: Request<void>,
  res: Response<SyncResponse>,
  next: NextFunction
) => {
  try {
    const player_id = getPlayerIdFromContext(res)

    const command = new RefreshCommand()
    await command.run({ player_id })

    const queries = new Queries({ repository: Factory.getRepository() })
    const result = await queries.sync({ player_id })

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
        name: building.name,
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
