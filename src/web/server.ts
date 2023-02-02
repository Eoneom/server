import express from 'express'
import { initWebsocketServer } from './websocket'

const app = express()
const port = 3000

initWebsocketServer(app)

app.get('/', (req, res) => {
  res.send('Hello world')
})

export const launch = () => {
  app.listen(port, () => {
    console.log(`Awesome server listening on port ${port}`)
  })
}
