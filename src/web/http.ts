import express from 'express'
import { App } from '../core/app'
import { initWebsocketServer } from './websocket'
import bodyParser from 'body-parser'
import cors from 'cors'

const http = express()
const port = 3000

initWebsocketServer(http)

http.use(cors())
http.use(bodyParser.json())

export const launchServer = (app: App) => {
  http.get('/', (req, res) => {
    res.send('Hello world')
  })

  http.listen(port, () => {
    console.log(`Awesome server listening on port ${port}`)
  })
}
