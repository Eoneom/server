import { Request, Response, NextFunction } from 'express'
import { troopListMovementHandler } from './list'
import { TroopMovementListQuery } from '#query/troop/movement/list'

type MockRes = {
  status: jest.Mock
  json: jest.Mock
  send: jest.Mock
  locals: Record<string, unknown>
}

const queryResult = {
  movements: [
    {
      id: 'm1',
      action: 'ATTACK',
      origin: { sector: 0, x: 0, y: 0 },
      destination: { sector: 0, x: 3, y: 4 },
      arrive_at: '2026-04-01T12:00:00.000Z'
    }
  ]
}

describe('troopListMovementHandler', () => {
  let req: Partial<Request>
  let res: MockRes
  let next: jest.Mock

  beforeEach(() => {
    req = {}
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      locals: { player_id: 'p1' }
    }
    next = jest.fn()
    jest.spyOn(TroopMovementListQuery.prototype, 'run').mockResolvedValue(queryResult as any)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('calls next with error when query throws', async () => {
    const error = new Error('query error')
    jest.spyOn(TroopMovementListQuery.prototype, 'run').mockRejectedValue(error)
    await troopListMovementHandler(req as Request, res as unknown as Response, next as NextFunction)
    expect(next).toHaveBeenCalledWith(error)
  })

  it('calls next with error when player_id is not in context', async () => {
    res.locals = {}
    await troopListMovementHandler(req as Request, res as unknown as Response, next as NextFunction)
    expect(next).toHaveBeenCalledWith(expect.any(Error))
  })

  it('returns mapped movement list on success', async () => {
    await troopListMovementHandler(req as Request, res as unknown as Response, next as NextFunction)
    expect(res.json).toHaveBeenCalledWith({
      status: 'ok',
      data: {
        movements: [
          {
            id: 'm1',
            action: 'ATTACK',
            origin: { sector: 0, x: 0, y: 0 },
            destination: { sector: 0, x: 3, y: 4 },
            arrive_at: '2026-04-01T12:00:00.000Z'
          }
        ]
      }
    })
  })
})
