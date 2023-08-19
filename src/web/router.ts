import { Router } from 'express'
import { buildingUpgradeHandler } from '#web/handler/building/upgrade'
import { loginHandler } from '#web/handler/player/login'
import { signupHandler } from '#web/handler/player/signup'
import { syncHandler } from '#web/handler/player/sync'
import { technologyResearchHandler } from '#web/handler/technology/research'
import { authMiddleware } from '#web/middleware/auth'
import { buildingListHandler } from '#web/handler/building/list'
import { technologyListHandler } from '#web/handler/technology/list'
import { buildingCancelHandler } from '#web/handler/building/cancel'
import { technologyCancelHandler } from '#web/handler/technology/cancel'
import { worldGetSectorHandler } from '#web/handler/world/get-sector'
import { cityListHandler } from '#web/handler/city/list'
import { buildingFinishUpgradeHandler } from '#web/handler/building/finish-upgrade'

export const router = (): Router => {
  const r = Router()

  r.get('/', (req, res) => {
    res.send({ status: 'ok' })
  })

  // Unauthenticated routes
  r.post('/player/login', loginHandler)
  r.post('/player/signup', signupHandler)

  // Authenticated routes
  r.post('/player/sync', authMiddleware, syncHandler)

  r.get('/city', authMiddleware, cityListHandler)
  r.get('/city/:city_id/building', authMiddleware, buildingListHandler)
  r.get('/city/:city_id/technology', authMiddleware, technologyListHandler)

  r.put('/building/cancel', authMiddleware, buildingCancelHandler)
  r.put('/building/upgrade', authMiddleware, buildingUpgradeHandler)
  r.put('/building/upgrade/finish', authMiddleware, buildingFinishUpgradeHandler)

  r.put('/technology/cancel', authMiddleware, technologyCancelHandler)
  r.put('/technology/research', authMiddleware, technologyResearchHandler)

  r.get('/sector/:sector', authMiddleware, worldGetSectorHandler)

  return r
}

