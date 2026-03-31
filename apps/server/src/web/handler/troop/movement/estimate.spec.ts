import { Request, Response, NextFunction } from 'express'
import { troopEstimateMovementHandler } from './estimate'
import { TroopMovementEstimateQuery } from '#query/troop/movement/estimate'

type MockRes = {
  status: jest.Mock
  json: jest.Mock
  send: jest.Mock
  locals: Record<string, unknown>
}

const origin = { x: 0, y: 0, sector: 0 }
const destination = { x: 3, y: 4, sector: 0 }
const troop_codes = ['WARRIOR']

describe('troopEstimateMovementHandler', () => {
  let req: Partial<Request>
  let res: MockRes
  let next: jest.Mock

  beforeEach(() => {
    req = { body: { origin, destination, troop_codes } }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      locals: {}
    }
    next = jest.fn()
    jest.spyOn(TroopMovementEstimateQuery.prototype, 'run').mockResolvedValue({
      distance: 5,
      speed: 2,
      duration: 150
    } as any)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('returns 400 when origin is missing', async () => {
    req.body = { destination, troop_codes }
    await troopEstimateMovementHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ status: 'nok', error_code: 'origin:not-found' })
  })

  it('returns 400 when destination is missing', async () => {
    req.body = { origin, troop_codes }
    await troopEstimateMovementHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ status: 'nok', error_code: 'destination:not-found' })
  })

  it('returns 400 when troop_codes is missing', async () => {
    req.body = { origin, destination }
    await troopEstimateMovementHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ status: 'nok', error_code: 'troop_codes:not-found' })
  })

  it('calls next with error when query throws', async () => {
    const error = new Error('query error')
    jest.spyOn(TroopMovementEstimateQuery.prototype, 'run').mockRejectedValue(error)
    await troopEstimateMovementHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(next).toHaveBeenCalledWith(error)
  })

  it('returns estimate data on success', async () => {
    await troopEstimateMovementHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      status: 'ok',
      data: { distance: 5, speed: 2, duration: 150 }
    })
  })
})
