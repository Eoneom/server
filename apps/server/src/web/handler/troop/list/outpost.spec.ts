import { Request, Response, NextFunction } from 'express'
import { troopListOutpostHandler } from './outpost'
import { TroopListQuery } from '#query/troop/list'

type MockRes = {
  status: jest.Mock
  json: jest.Mock
  send: jest.Mock
  locals: Record<string, unknown>
}

const queryResult = {
  troops: [
    {
      id: 't2',
      code: 'ARCHER',
      count: 3,
      ongoing_recruitment: undefined
    }
  ],
  costs: {
    ARCHER: { duration: 90 }
  }
}

describe('troopListOutpostHandler', () => {
  let req: Partial<Request>
  let res: MockRes
  let next: jest.Mock

  beforeEach(() => {
    req = { params: { outpost_id: 'o1' } }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      locals: { player_id: 'p1' }
    }
    next = jest.fn()
    jest.spyOn(TroopListQuery.prototype, 'run').mockResolvedValue(queryResult as any)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('returns 400 when outpost_id is missing', async () => {
    req.params = {}
    await troopListOutpostHandler(req as Request, res as unknown as Response, next as NextFunction)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ status: 'nok', error_code: 'outpost_id:not-found' })
  })

  it('calls next with error when query throws', async () => {
    const error = new Error('query error')
    jest.spyOn(TroopListQuery.prototype, 'run').mockRejectedValue(error)
    await troopListOutpostHandler(req as Request, res as unknown as Response, next as NextFunction)
    expect(next).toHaveBeenCalledWith(error)
  })

  it('calls query with outpost location and returns mapped troops', async () => {
    await troopListOutpostHandler(req as Request, res as unknown as Response, next as NextFunction)
    expect(TroopListQuery.prototype.run).toHaveBeenCalledWith({
      player_id: 'p1',
      location: { type: 'outpost', outpost_id: 'o1' }
    })
    expect(res.json).toHaveBeenCalledWith({
      status: 'ok',
      data: {
        troops: [
          {
            id: 't2',
            code: 'ARCHER',
            count: 3,
            ongoing_recruitment: undefined
          }
        ]
      }
    })
  })
})
