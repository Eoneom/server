import { Request, Response, NextFunction } from 'express'
import { outpostGetHandler } from './get'
import { OutpostGetQuery } from '#query/outpost/get'

type MockRes = {
  status: jest.Mock
  json: jest.Mock
  send: jest.Mock
  locals: Record<string, unknown>
}

const queryResult = {
  outpost: { id: 'o1', type: 'STANDARD' },
  cell: { coordinates: { x: 3, y: 5, sector: 1 } },
  resource_stock: { plastic: 150, mushroom: 75 }
}

describe('outpostGetHandler', () => {
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
    jest.spyOn(OutpostGetQuery.prototype, 'run').mockResolvedValue(queryResult as any)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('returns 400 when outpost_id is missing', async () => {
    req.params = {}
    await outpostGetHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ status: 'nok', error_code: 'outpost_id:not-found' })
  })

  it('calls next with error when query throws', async () => {
    const error = new Error('query error')
    jest.spyOn(OutpostGetQuery.prototype, 'run').mockRejectedValue(error)
    await outpostGetHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(next).toHaveBeenCalledWith(error)
  })

  it('returns outpost data on success', async () => {
    await outpostGetHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(res.json).toHaveBeenCalledWith({
      status: 'ok',
      data: {
        id: 'o1',
        coordinates: { x: 3, y: 5, sector: 1 },
        type: 'STANDARD',
        plastic: 150,
        mushroom: 75
      }
    })
  })
})
