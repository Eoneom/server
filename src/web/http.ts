import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { router } from '#web/router'
import { errorMiddleware } from '#web/middleware/error'

const http = express()
const port = 3000

http.use(cors())
http.use(bodyParser.json())

export const launchServer = () => {
  http.use(router)
  http.use(errorMiddleware)

  http.listen(port, () => {
    console.log(`Awesome server listening on port ${port}`)
  })
}
