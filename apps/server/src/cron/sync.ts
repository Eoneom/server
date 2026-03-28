import { Factory } from '#adapter/factory'
import { sagaSyncPlayer } from '#app/saga/sync-player'
import { now } from '#shared/time'

const logger = Factory.getLogger('cron:sync')

export const cronSync = async () => {
  logger.info('sync cron executing...')
  const repository = Factory.getRepository()

  const one_hour_in_milliseconds = 3600 * 1000
  const player_ids = await repository.player.getInactivePlayerIds({ lookup_time: now() - one_hour_in_milliseconds })
  logger.info(`synchronizing ${player_ids.length} players`)

  await Promise.all(player_ids.map(player_id => sagaSyncPlayer({ player_id })))

  logger.info('players synchronization done')
}
