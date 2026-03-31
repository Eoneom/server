import { Request, Response, NextFunction } from 'express'
import { outpostListHandler } from './list'
import { OutpostListQuery } from '#query/outpost/list'

type MockRes = {
  status: jest.Mock
  json: jest.Mock
  send: jest.Mock
  locals: Record<string, unknown>
}

const queryResult = {
  outposts: [{ id: 'o1', type: 'STANDARD', cell_id: 'cell1' }],
  cells: [{ id: 'cell1', coordinates: { x: 2, y: 4, sector: 0 } }],
  resource_stocks: [{ cell_id: 'cell1', plastic: 200, mushroom: 100 }]
}

describe('outpostListHandler', () => {
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
    jest.spyOn(OutpostListQuery.prototype, 'run').mockResolvedValue(queryResult as any)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('calls next with error when query throws', async () => {
    const error = new Error('query error')
    jest.spyOn(OutpostListQuery.prototype, 'run').mockRejectedValue(error)
    await outpostListHandler(req as Request, res as unknown as Response, next as NextFunction)
    expect(next).toHaveBeenCalledWith(error)
  })

  it('calls next with error when player_id is not in context', async () => {
    res.locals = {}
    await outpostListHandler(req as Request, res as unknown as Response, next as NextFunction)
    expect(next).toHaveBeenCalledWith(expect.any(Error))
  })

  it('returns mapped outpost list on success', async () => {
    await outpostListHandler(req as Request, res as unknown as Response, next as NextFunction)
    expect(res.json).toHaveBeenCalledWith({
      status: 'ok',
      data: {
        outposts: [
          {
            id: 'o1',
            coordinates: { x: 2, y: 4, sector: 0 },
            type: 'STANDARD',
            plastic: 200,
            mushroom: 100
          }
        ]
      }
    })
  })
})
