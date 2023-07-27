import { Factory } from '#core/factory'
import { launchServer } from '#web/http'

(async () => {
  const repository = Factory.getRepository()
  await repository.connect()

  launchServer()
})()
