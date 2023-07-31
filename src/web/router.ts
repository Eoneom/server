import { Router } from 'express'
import { buildingUpgradeHandler } from '#web/handler/building/upgrade'
import { loginHandler } from '#web/handler/player/login'
import { signupHandler } from '#web/handler/player/signup'
import { syncHandler } from '#web/handler/player/sync'
import { technologyResearchHandler } from '#web/handler/technology/research'
import { authMiddleware } from '#web/middleware/auth'
import { buildingListHandler } from '#web/handler/building/list'

export const router = (): Router => {
  const r = Router()

  r.get('/', (req, res) => {
    res.send({ status: 'ok' })
  })

  r.post('/player/login', loginHandler)
  r.post('/player/signup', signupHandler)

  r.post('/player/sync', authMiddleware, syncHandler)

  r.get('/city/:city_id/building', authMiddleware, buildingListHandler)

  r.put('/building/upgrade', authMiddleware, buildingUpgradeHandler)

  r.put('/technology/research', authMiddleware, technologyResearchHandler)

  return r
}

