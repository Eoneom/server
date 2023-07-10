import { Router } from 'express'
import { App } from '../app'
import { signup_handler } from './handler/signup'
import { building_upgrade_handler } from './handler/building-upgrade'
import { refresh_handler } from './handler/refresh'
import { sync_handler } from './handler/sync'

export const router = (app: App): Router => {
  const r = Router()

  r.get('/', (req, res) => {
    res.send({ status: 'ok' })
  })

  r.post('/signup', signup_handler(app))

  r.put('/building/upgrade', building_upgrade_handler(app))

  r.put('/refresh', refresh_handler(app))

  r.post('/sync', sync_handler(app))

  return r
}

