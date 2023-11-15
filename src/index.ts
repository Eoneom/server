import { WorldGenerateCommand } from '#app/command/world/generate'
import { Factory } from '#adapter/factory'
import { WorldError } from '#core/world/error'
import { launchServer } from '#web/http'
import { sync_task } from '#cron/index'

(async () => {
  const repository = Factory.getRepository()
  const logger = Factory.getLogger('index')
  await repository.connect()

  try {
    await new WorldGenerateCommand().run()
  } catch (err: any) {
    if (err.message !== WorldError.ALREADY_EXISTS) {
      logger.error(err.message)
    }
  }

  launchServer()

  sync_task.start()
})()
