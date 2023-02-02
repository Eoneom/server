import expressWs from "express-ws"
import { Express } from "express"
import { Factory } from "../core/factory"
import { event_codes } from "../core/eventbus"

export const initWebsocketServer = (app: Express) => {
  const wsInstance = expressWs(app)

  wsInstance.app.ws('/', (ws, req) => {
    const eventbus = Factory.getEventBus()
    const eventbus_unregisters: (() => void)[] = []
    Object.values(event_codes).forEach(event => {
      const { unregister } = eventbus.listen(event, (payload) => {
        ws.emit(event, payload)
      })

      eventbus_unregisters.push(unregister)
    })

    ws.on('close', async () => {
      await Promise.all(eventbus_unregisters)
    })

    ws.on('message', (msg) => {
      try {
        const body = JSON.parse(msg.toString())
        if (!body.code) {
          console.log('missing code')
          return
        }
        const payload = body.payload ?? {}

        eventbus.emit(body.code, payload)
      } catch (err) {
        console.error(err)
      }
    })
  })
}
