import {
  vi, type MockInstance 
} from 'vitest'
import {
  Request, Response, NextFunction 
} from 'express'
import { buildingFinishUpgradeHandler } from './finish-upgrade'
import { sagaFinishUpgrade } from '#app/saga/finish/upgrade'

vi.mock('#app/saga/finish/upgrade')

type MockRes = {
  status: MockInstance
  json: MockInstance
  send: MockInstance
  locals: Record<string, unknown>
}

describe('buildingFinishUpgradeHandler', () => {
  let req: Partial<Request>
  let res: MockRes
  let next: MockInstance

  beforeEach(() => {
    req = { body: { city_id: 'c1' } }
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
      locals: { player_id: 'p1' }
    }
    next = vi.fn()
    ;(sagaFinishUpgrade as MockInstance).mockResolvedValue(undefined)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns 400 when city_id is missing', async () => {
    req.body = {}
    await buildingFinishUpgradeHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      status: 'nok',
      error_code: 'city_id:not-found' 
    })
  })

  it('calls next with error when player_id is not in context', async () => {
    res.locals = {}
    await buildingFinishUpgradeHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(next).toHaveBeenCalledWith(expect.any(Error))
  })

  it('fires saga with correct args and returns ok', async () => {
    await buildingFinishUpgradeHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(sagaFinishUpgrade).toHaveBeenCalledWith({
      player_id: 'p1',
      city_id: 'c1' 
    })
    expect(res.json).toHaveBeenCalledWith({ status: 'ok' })
  })
})
