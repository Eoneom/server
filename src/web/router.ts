import { Router } from 'express'
import { App } from '#app'
import { buildingUpgradeHandler } from '#web/handler/building/upgrade'
import { loginHandler } from '#web/handler/player/login'
import { refreshHandler } from '#web/handler/player/refresh'
import { signupHandler } from '#web/handler/player/signup'
import { syncHandler } from '#web/handler/player/sync'
import { technologyResearchHandler } from '#web/handler/technology/research'
import { authMiddleware } from '#web/middleware/auth'

export const router = (app: App): Router => {
  const r = Router()

  r.get('/', (req, res) => {
    res.send({ status: 'ok' })
  })

  r.post('/player/login', loginHandler(app))
  r.post('/player/signup', signupHandler(app))

  r.put('/player/refresh', authMiddleware(app), refreshHandler(app))
  r.post('/player/sync', authMiddleware(app), syncHandler(app))

  r.put('/building/upgrade', authMiddleware(app), buildingUpgradeHandler(app))

  r.put('/technology/research', authMiddleware(app), technologyResearchHandler(app))

  return r
}

