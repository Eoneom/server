import { Router } from 'express'
import { App } from '#app'
import { building_upgrade_handler } from '#web/handler/building/upgrade'
import { login_handler } from '#web/handler/player/login'
import { refresh_handler } from '#web/handler/player/refresh'
import { signup_handler } from '#web/handler/player/signup'
import { sync_handler } from '#web/handler/player/sync'
import { technology_research_handler } from '#web/handler/techonology/research'

export const router = (app: App): Router => {
  const r = Router()

  r.get('/', (req, res) => {
    res.send({ status: 'ok' })
  })

  r.post('/player/login', login_handler(app))
  r.post('/player/signup', signup_handler(app))
  r.put('/player/refresh', refresh_handler(app))
  r.post('/player/sync', sync_handler(app))

  r.put('/building/upgrade', building_upgrade_handler(app))

  r.put('/technology/research', technology_research_handler(app))

  return r
}

