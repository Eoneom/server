import { WorldGenerateCommand } from '#app/command/world/generate'
import { Factory } from '#adapter/factory'
import { WorldError } from '#core/world/error'
import { launchServer } from '#web/http'

(async () => {
  const repository = Factory.getRepository()
  const logger = Factory.getLogger('index')
  await repository.connect()

  const generate_world_command = new WorldGenerateCommand()
  try {
    await generate_world_command.run()
  } catch (err: any) {
    if (err.message !== WorldError.ALREADY_EXISTS) {
      logger.error(err.message)
    }
  }

  launchServer()
})()
