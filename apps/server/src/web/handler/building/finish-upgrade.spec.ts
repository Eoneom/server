import { Request, Response, NextFunction } from 'express'
import { buildingFinishUpgradeHandler } from './finish-upgrade'
import { sagaFinishUpgrade } from '#app/saga/finish/upgrade'

jest.mock('#app/saga/finish/upgrade')

type MockRes = {
  status: jest.Mock
  json: jest.Mock
  send: jest.Mock
  locals: Record<string, unknown>
}

describe('buildingFinishUpgradeHandler', () => {
  let req: Partial<Request>
  let res: MockRes
  let next: jest.Mock

  beforeEach(() => {
    req = { body: { city_id: 'c1' } }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      locals: { player_id: 'p1' }
    }
    next = jest.fn()
    ;(sagaFinishUpgrade as jest.Mock).mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('returns 400 when city_id is missing', async () => {
    req.body = {}
    await buildingFinishUpgradeHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ status: 'nok', error_code: 'city_id:not-found' })
  })

  it('calls next with error when player_id is not in context', async () => {
    res.locals = {}
    await buildingFinishUpgradeHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(next).toHaveBeenCalledWith(expect.any(Error))
  })

  it('fires saga with correct args and returns ok', async () => {
    await buildingFinishUpgradeHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(sagaFinishUpgrade).toHaveBeenCalledWith({ player_id: 'p1', city_id: 'c1' })
    expect(res.json).toHaveBeenCalledWith({ status: 'ok' })
  })
})
