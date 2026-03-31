import { Factory } from '#adapter/factory'
import { sagaRefreshGameState } from '#app/saga/game/refresh-state'

const logger = Factory.getLogger('saga:sync-player')

export const sagaSyncPlayer = async ({ player_id }: { player_id: string }) => {
  const repository = Factory.getRepository()
  logger.info(player_id)

  const cities = await repository.city.list({ player_id })
  await Promise.all(cities.map(async city => {
    await sagaRefreshGameState({
      player_id,
      city_id: city.id
    })
  }))
}
