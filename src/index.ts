import { App } from './app'
import { Factory } from './core/factory'
import { initData } from './core/migrations'
import { logEvents } from './log'
import { launchServer } from './web/http'

(async () => {
  const repository = Factory.getRepository()
  await repository.connect()

  const app = new App()

  const eventbus = Factory.getEventBus()

  logEvents(eventbus)

  await initData(app)

  launchServer(app)
})()
