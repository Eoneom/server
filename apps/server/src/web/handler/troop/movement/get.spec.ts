import { Request, Response, NextFunction } from 'express'
import { troopGetMovementHandler } from './get'
import { TroopMovementGetQuery } from '#query/troop/movement/get'

type MockRes = {
  status: jest.Mock
  json: jest.Mock
  send: jest.Mock
  locals: Record<string, unknown>
}

const queryResult = {
  movement: {
    action: 'ATTACK',
    origin: { sector: 0, x: 0, y: 0 },
    destination: { sector: 0, x: 3, y: 4 },
    arrive_at: '2026-04-01T12:00:00.000Z'
  },
  troops: [{ code: 'WARRIOR', count: 8 }]
}

describe('troopGetMovementHandler', () => {
  let req: Partial<Request>
  let res: MockRes
  let next: jest.Mock

  beforeEach(() => {
    req = { params: { movement_id: 'm1' } }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      locals: { player_id: 'p1' }
    }
    next = jest.fn()
    jest.spyOn(TroopMovementGetQuery.prototype, 'run').mockResolvedValue(queryResult as any)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('returns 400 when movement_id is missing', async () => {
    req.params = {}
    await troopGetMovementHandler(req as Request, res as unknown as Response, next as NextFunction)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ status: 'nok', error_code: 'movement_id:not-found' })
  })

  it('calls next with error when query throws', async () => {
    const error = new Error('query error')
    jest.spyOn(TroopMovementGetQuery.prototype, 'run').mockRejectedValue(error)
    await troopGetMovementHandler(req as Request, res as unknown as Response, next as NextFunction)
    expect(next).toHaveBeenCalledWith(error)
  })

  it('returns movement data on success', async () => {
    await troopGetMovementHandler(req as Request, res as unknown as Response, next as NextFunction)
    expect(res.json).toHaveBeenCalledWith({
      status: 'ok',
      data: {
        action: 'ATTACK',
        origin: { sector: 0, x: 0, y: 0 },
        destination: { sector: 0, x: 3, y: 4 },
        arrive_at: '2026-04-01T12:00:00.000Z',
        troops: [{ code: 'WARRIOR', count: 8 }]
      }
    })
  })
})
