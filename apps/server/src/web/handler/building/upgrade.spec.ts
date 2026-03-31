import { Request, Response, NextFunction } from 'express'
import { buildingUpgradeHandler } from './upgrade'
import { sagaUpgradeBuilding } from '#app/saga/upgrade-building'

jest.mock('#app/saga/upgrade-building')

type MockRes = {
  status: jest.Mock
  json: jest.Mock
  send: jest.Mock
  locals: Record<string, unknown>
}

describe('buildingUpgradeHandler', () => {
  let req: Partial<Request>
  let res: MockRes
  let next: jest.Mock

  beforeEach(() => {
    req = { body: { city_id: 'c1', building_code: 'SAWMILL' } }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      locals: { player_id: 'p1' }
    }
    next = jest.fn()
    ;(sagaUpgradeBuilding as jest.Mock).mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('returns 400 when city_id is missing', async () => {
    req.body = { building_code: 'SAWMILL' }
    await buildingUpgradeHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ status: 'nok', error_code: 'city_id:not-found' })
  })

  it('returns 400 when building_code is missing', async () => {
    req.body = { city_id: 'c1' }
    await buildingUpgradeHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ status: 'nok', error_code: 'building_code:not-found' })
  })

  it('calls next with error when saga throws', async () => {
    const error = new Error('upgrade error')
    ;(sagaUpgradeBuilding as jest.Mock).mockRejectedValue(error)
    await buildingUpgradeHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(next).toHaveBeenCalledWith(error)
  })

  it('calls saga with correct args and returns ok', async () => {
    await buildingUpgradeHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(sagaUpgradeBuilding).toHaveBeenCalledWith({ player_id: 'p1', city_id: 'c1', building_code: 'SAWMILL' })
    expect(res.json).toHaveBeenCalledWith({ status: 'ok' })
  })
})
