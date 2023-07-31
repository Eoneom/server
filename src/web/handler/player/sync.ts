import {
  NextFunction, Request, Response
} from 'express'
import {
  SyncResponse, SyncDataResponse
} from '#client/src/endpoints/player/sync'
import { PlayerEntity } from '#core/player/entity'
import { CityEntity } from '#core/city/entity'
import { getPlayerIdFromContext } from '#web/helpers'
import { Queries } from '#app/queries'
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

    const result = await Queries.sync({ player_id })

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
  cities,
}: {
  player: PlayerEntity
  cities: CityEntity[]
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
      mushroom: city.mushroom
    }))
  }
}
