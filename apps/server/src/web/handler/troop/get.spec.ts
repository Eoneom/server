import { Request, Response, NextFunction } from 'express'
import { troopGetHandler } from './get'
import { TroopGetQuery } from '#query/troop/get'

type MockRes = {
  status: jest.Mock
  json: jest.Mock
  send: jest.Mock
  locals: Record<string, unknown>
}

const queryResult = {
  troop: { id: 't1', code: 'WARRIOR', count: 10, ongoing_recruitment: undefined },
  cost: { resource: { plastic: 50, mushroom: 25 }, duration: 1800 },
  requirement: { buildings: [], technologies: [] }
}

describe('troopGetHandler', () => {
  let req: Partial<Request>
  let res: MockRes
  let next: jest.Mock

  beforeEach(() => {
    req = { params: { troop_id: 't1' } }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      locals: { player_id: 'p1' }
    }
    next = jest.fn()
    jest.spyOn(TroopGetQuery.prototype, 'run').mockResolvedValue(queryResult as any)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('returns 400 when troop_id is missing', async () => {
    req.params = {}
    await troopGetHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ status: 'nok', error_code: 'troop_id:not-found' })
  })

  it('calls next with error when query throws', async () => {
    const error = new Error('query error')
    jest.spyOn(TroopGetQuery.prototype, 'run').mockRejectedValue(error)
    await troopGetHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(next).toHaveBeenCalledWith(error)
  })

  it('returns troop data on success', async () => {
    await troopGetHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(res.json).toHaveBeenCalledWith({
      status: 'ok',
      data: {
        id: 't1',
        code: 'WARRIOR',
        count: 10,
        ongoing_recruitment: undefined,
        cost: { plastic: 50, mushroom: 25, duration: 1800 },
        requirement: { buildings: [], technologies: [] }
      }
    })
  })
})
