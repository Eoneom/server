import { App } from '#app'
import { Factory } from '#core/factory'
import { initData } from '#core/migration/index'
import { launchServer } from '#web/http'

(async () => {
  const repository = Factory.getRepository()
  await repository.connect()

  const app = new App()

  await initData(app)

  launchServer(app)
})()
