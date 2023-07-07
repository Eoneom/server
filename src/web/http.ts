import express from 'express'
import { App } from '../core/app'
import { initWebsocketServer } from './websocket'
import bodyParser from 'body-parser'
import cors from 'cors'
import { router } from './router'

const http = express()
const port = 3000

initWebsocketServer(http)

http.use(cors())
http.use(bodyParser.json())

export const launchServer = (app: App) => {
  http.use(router(app))

  http.listen(port, () => {
    console.log(`Awesome server listening on port ${port}`)
  })
}