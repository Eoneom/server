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

  r.post('/player/login', loginHandler)
  r.post('/player/signup', signupHandler)

  r.put('/player/refresh', authMiddleware(app), refreshHandler)
  r.post('/player/sync', authMiddleware(app), syncHandler(app))

  r.put('/building/upgrade', authMiddleware(app), buildingUpgradeHandler)

  r.put('/technology/research', authMiddleware(app), technologyResearchHandler)

  return r
}

