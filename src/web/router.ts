import { Router } from 'express'
import { buildingUpgradeHandler } from '#web/handler/building/upgrade'
import { loginHandler } from '#web/handler/player/login'
import { signupHandler } from '#web/handler/player/signup'
import { technologyResearchHandler } from '#web/handler/technology/research'
import { authMiddleware } from '#web/middleware/auth'
import { buildingListHandler } from '#web/handler/building/list'
import { technologyListHandler } from '#web/handler/technology/list'
import { buildingCancelHandler } from '#web/handler/building/cancel'
import { technologyCancelHandler } from '#web/handler/technology/cancel'
import { worldGetSectorHandler } from '#web/handler/world/get-sector'
import { cityListHandler } from '#web/handler/city/list'
import { buildingFinishUpgradeHandler } from '#web/handler/building/finish-upgrade'
import { technologyFinishResearchHandler } from '#web/handler/technology/finish-research'
import { cityGatherHandler } from '#web/handler/city/gather'
import { troupRecruitHandler } from '#web/handler/troup/recruit'
import { troupListHandler } from '#web/handler/troup/list'
import { troupProgressRecruitHandler } from '#web/handler/troup/progress-recruit'
import { troupCancelHandler } from '#web/handler/troup/cancel'
import { troupExploreHandler } from '#web/handler/troup/explore'
import { troupListMovementHandler } from '#web/handler/troup/list-movement'
import { troupFinishMovementHandler } from '#web/handler/troup/finish-movement'
import { communicationListReportHandler } from '#web/handler/communication/list-report'
import { cityGetHandler } from '#web/handler/city/get'

export const router = (): Router => {
  const r = Router()

  r.get('/', (req, res) => {
    res.send({ status: 'ok' })
  })

  // Unauthenticated routes
  r.post('/player/login', loginHandler)
  r.post('/player/signup', signupHandler)

  // Authenticated routes
  r.get('/city', authMiddleware, cityListHandler)
  r.get('/city/:city_id', authMiddleware, cityGetHandler)
  r.put('/city/gather', authMiddleware, cityGatherHandler)
  r.get('/city/:city_id/troup', authMiddleware, troupListHandler)
  r.get('/city/:city_id/troup/movement', authMiddleware, troupListMovementHandler)
  r.get('/city/:city_id/building', authMiddleware, buildingListHandler)
  r.get('/city/:city_id/technology', authMiddleware, technologyListHandler)

  r.put('/building/cancel', authMiddleware, buildingCancelHandler)
  r.put('/building/upgrade', authMiddleware, buildingUpgradeHandler)
  r.put('/building/upgrade/finish', authMiddleware, buildingFinishUpgradeHandler)

  r.put('/technology/cancel', authMiddleware, technologyCancelHandler)
  r.put('/technology/research', authMiddleware, technologyResearchHandler)
  r.put('/technology/research/finish', authMiddleware, technologyFinishResearchHandler)

  r.put('/troup/explore', authMiddleware, troupExploreHandler)
  r.put('/troup/cancel', authMiddleware, troupCancelHandler)
  r.put('/troup/recruit/progress', authMiddleware, troupProgressRecruitHandler)
  r.put('/troup/movement/:movement_id/finish', authMiddleware, troupFinishMovementHandler)
  r.put('/troup/recruit', authMiddleware, troupRecruitHandler)

  r.get('/sector/:sector', authMiddleware, worldGetSectorHandler)

  r.get('/communication/report', authMiddleware, communicationListReportHandler)

  return r
}

