import { Router } from 'express'
import { App } from '../app'
import { signup_handler } from './handler/player/signup'
import { building_upgrade_handler } from './handler/building/upgrade'
import { refresh_handler } from './handler/player/refresh'
import { sync_handler } from './handler/player/sync'

export const router = (app: App): Router => {
  const r = Router()

  r.get('/', (req, res) => {
    res.send({ status: 'ok' })
  })

  r.post('/player/signup', signup_handler(app))
  r.put('/player/refresh', refresh_handler(app))
  r.post('/player/sync', sync_handler(app))

  r.put('/building/upgrade', building_upgrade_handler(app))

  return r
}

