import { Router } from 'express'
import { authMiddleware } from '#web/middleware/auth'
import { buildingCancelHandler } from '#web/handler/building/cancel'
import { buildingFinishUpgradeHandler } from '#web/handler/building/finish-upgrade'
import { buildingGetHandler } from '#web/handler/building/get'
import { buildingListHandler } from '#web/handler/building/list'
import { buildingUpgradeHandler } from '#web/handler/building/upgrade'
import { cityGatherHandler } from '#web/handler/city/gather'
import { cityGetHandler } from '#web/handler/city/get'
import { cityListHandler } from '#web/handler/city/list'
import { communicationListReportHandler } from '#web/handler/communication/report/list'
import { loginHandler } from '#web/handler/player/login'
import { signupHandler } from '#web/handler/player/signup'
import { technologyCancelHandler } from '#web/handler/technology/cancel'
import { technologyFinishResearchHandler } from '#web/handler/technology/finish-research'
import { technologyListHandler } from '#web/handler/technology/list'
import { technologyResearchHandler } from '#web/handler/technology/research'
import { troupCancelHandler } from '#web/handler/troup/cancel'
import { troupExploreHandler } from '#web/handler/troup/explore'
import { troupFinishMovementHandler } from '#web/handler/troup/finish-movement'
import { troupListHandler } from '#web/handler/troup/list'
import { troupListMovementHandler } from '#web/handler/troup/list-movement'
import { troupProgressRecruitHandler } from '#web/handler/troup/progress-recruit'
import { troupRecruitHandler } from '#web/handler/troup/recruit'
import { worldGetSectorHandler } from '#web/handler/world/get-sector'
import { technologyGetHandler } from '#web/handler/technology/get'
import { troupBaseHandler } from '#web/handler/troup/base'
import { outpostListHandler } from '#web/handler/outpost/list'
import { outpostGetHandler } from '#web/handler/outpost/get'
import { communicationGetReportHandler } from '#web/handler/communication/report/get'
import { communicationCountUnreadReportHandler } from '#web/handler/communication/report/count-unread'
import { communicationMarkReportHandler } from '#web/handler/communication/report/mark'

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

  r.get('/city/:city_id/building', authMiddleware, buildingListHandler)
  r.get('/city/:city_id/building/:building_code', authMiddleware, buildingGetHandler)
  r.put('/building/cancel', authMiddleware, buildingCancelHandler)
  r.put('/building/upgrade', authMiddleware, buildingUpgradeHandler)
  r.put('/building/upgrade/finish', authMiddleware, buildingFinishUpgradeHandler)

  r.get('/technology', authMiddleware, technologyListHandler)
  r.get('/city/:city_id/technology/:technology_code', authMiddleware, technologyGetHandler)
  r.put('/technology/cancel', authMiddleware, technologyCancelHandler)
  r.put('/technology/research', authMiddleware, technologyResearchHandler)
  r.put('/technology/research/finish', authMiddleware, technologyFinishResearchHandler)

  r.get('/city/:city_id/troup', authMiddleware, troupListHandler)
  r.get('/city/:city_id/troup/movement', authMiddleware, troupListMovementHandler)
  r.put('/troup/base', authMiddleware, troupBaseHandler)
  r.put('/troup/explore', authMiddleware, troupExploreHandler)
  r.put('/troup/cancel', authMiddleware, troupCancelHandler)
  r.put('/troup/recruit/progress', authMiddleware, troupProgressRecruitHandler)
  r.put('/troup/movement/:movement_id/finish', authMiddleware, troupFinishMovementHandler)
  r.put('/troup/recruit', authMiddleware, troupRecruitHandler)

  r.get('/outpost', authMiddleware, outpostListHandler)
  r.get('/outpost/:outpost_id', authMiddleware, outpostGetHandler)

  r.get('/sector/:sector', authMiddleware, worldGetSectorHandler)

  r.get('/communication/report', authMiddleware, communicationListReportHandler)
  r.put('/communication/report/mark', authMiddleware, communicationMarkReportHandler)
  r.get('/communication/report/unread/count', authMiddleware, communicationCountUnreadReportHandler)
  r.get('/communication/report/:report_id', authMiddleware, communicationGetReportHandler)

  return r
}

