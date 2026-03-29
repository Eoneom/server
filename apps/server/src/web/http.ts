import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { router } from '#web/router'
import { errorMiddleware } from '#web/middleware/error'
import { Factory } from '#adapter/factory'

const http = express()
const rawPort = Number.parseInt(
  process.env.HTTP_PORT ?? '3000',
  10
)
const port =
  Number.isFinite(rawPort) && rawPort > 0 ? rawPort : 3000
const logger = Factory.getLogger('web:http')

http.use(cors())
http.use(bodyParser.json())

export const launchServer = () => {
  http.use(router())
  http.use(errorMiddleware)

  http.listen(port, () => {
    logger.info('awesome server listening', { port })
  })
}
