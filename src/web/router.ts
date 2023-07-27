import { Router } from 'express'
import { buildingUpgradeHandler } from '#web/handler/building/upgrade'
import { loginHandler } from '#web/handler/player/login'
import { refreshHandler } from '#web/handler/player/refresh'
import { signupHandler } from '#web/handler/player/signup'
import { syncHandler } from '#web/handler/player/sync'
import { technologyResearchHandler } from '#web/handler/technology/research'
import { authMiddleware } from '#web/middleware/auth'

export const router = (): Router => {
  const r = Router()

  r.get('/', (req, res) => {
    res.send({ status: 'ok' })
  })

  r.post('/player/login', loginHandler)
  r.post('/player/signup', signupHandler)

  r.put('/player/refresh', authMiddleware, refreshHandler)
  r.post('/player/sync', authMiddleware, syncHandler)

  r.put('/building/upgrade', authMiddleware, buildingUpgradeHandler)

  r.put('/technology/research', authMiddleware, technologyResearchHandler)

  return r
}

