import { Request, Response, NextFunction } from 'express'
import { worldGetSectorHandler } from './get-sector'
import { WorldGetSectorQuery } from '#query/world/get-sector'

type MockRes = {
  status: jest.Mock
  json: jest.Mock
  send: jest.Mock
  locals: Record<string, unknown>
}

const queryResult = {
  cells: [
    {
      id: 'cell1',
      coordinates: { x: 2, y: 3 },
      type: 'PLAIN',
      resource_coefficient: { plastic: 1.2, mushroom: 0.8 }
    },
    {
      id: 'cell2',
      coordinates: { x: 2, y: 4 },
      type: 'FOREST',
      resource_coefficient: { plastic: 0.5, mushroom: 1.5 }
    }
  ],
  explored_cell_ids: ['cell1']
}

describe('worldGetSectorHandler', () => {
  let req: Partial<Request>
  let res: MockRes
  let next: jest.Mock

  beforeEach(() => {
    req = { params: { sector: '1' } }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      locals: { player_id: 'p1' }
    }
    next = jest.fn()
    jest.spyOn(WorldGetSectorQuery.prototype, 'run').mockResolvedValue(queryResult as any)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('returns 400 when sector is missing', async () => {
    req.params = {}
    await worldGetSectorHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ status: 'nok', error_code: 'sector:not-found' })
  })

  it('calls next with error when query throws', async () => {
    const error = new Error('query error')
    jest.spyOn(WorldGetSectorQuery.prototype, 'run').mockRejectedValue(error)
    await worldGetSectorHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(next).toHaveBeenCalledWith(error)
  })

  it('returns mapped sector cells on success', async () => {
    await worldGetSectorHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(res.json).toHaveBeenCalledWith({
      status: 'ok',
      data: {
        cells: [
          {
            coordinates: { x: 2, y: 3 },
            characteristic: {
              type: 'PLAIN',
              resource_coefficient: { plastic: 1.2, mushroom: 0.8 }
            }
          },
          {
            coordinates: { x: 2, y: 4 },
            characteristic: undefined
          }
        ]
      }
    })
  })
})
