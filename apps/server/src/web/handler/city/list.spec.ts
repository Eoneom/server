import { Request, Response, NextFunction } from 'express'
import { cityListHandler } from './list'
import { CityListQuery } from '#query/city/list'

type MockRes = {
  status: jest.Mock
  json: jest.Mock
  send: jest.Mock
  locals: Record<string, unknown>
}

const queryResult = {
  cities: [
    { id: 'c1', name: 'Aliceton' },
    { id: 'c2', name: 'Bobburg' }
  ]
}

describe('cityListHandler', () => {
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
    jest.spyOn(CityListQuery.prototype, 'run').mockResolvedValue(queryResult as any)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('calls next with error when query throws', async () => {
    const error = new Error('query error')
    jest.spyOn(CityListQuery.prototype, 'run').mockRejectedValue(error)
    await cityListHandler(req as Request, res as unknown as Response, next as NextFunction)
    expect(next).toHaveBeenCalledWith(error)
  })

  it('calls next with error when player_id is not in context', async () => {
    res.locals = {}
    await cityListHandler(req as Request, res as unknown as Response, next as NextFunction)
    expect(next).toHaveBeenCalledWith(expect.any(Error))
  })

  it('returns city list on success', async () => {
    await cityListHandler(req as Request, res as unknown as Response, next as NextFunction)
    expect(res.json).toHaveBeenCalledWith({
      status: 'ok',
      data: {
        cities: [
          { id: 'c1', name: 'Aliceton' },
          { id: 'c2', name: 'Bobburg' }
        ]
      }
    })
  })
})
