import './load-env'

import { generateWorld } from '#app/command/world/generate'
import { Factory } from '#adapter/factory'
import { WorldError } from '#core/world/error'
import { gameTimeScale } from '#shared/game-time-scale'
import { launchServer } from '#web/http'
import { sync_task } from '#cron/index'

(async () => {
  const repository = Factory.getRepository()
  const logger = Factory.getLogger('index')
  if (gameTimeScale !== 1) {
    logger.warn('game time scale active', { gameTimeScale })
  }
  await repository.connect()

  try {
    await generateWorld()
  } catch (err: any) {
    if (err.message !== WorldError.ALREADY_EXISTS) {
      logger.error(err.message)
    }
  }

  launchServer()

  sync_task.start()
})()
