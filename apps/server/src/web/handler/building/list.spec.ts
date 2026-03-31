import { Request, Response, NextFunction } from 'express'
import { buildingListHandler } from './list'
import { BuildingListQuery } from '#query/building/list'

type MockRes = {
  status: jest.Mock
  json: jest.Mock
  send: jest.Mock
  locals: Record<string, unknown>
}

const queryData = [{ code: 'SAWMILL', level: 1 }]

describe('buildingListHandler', () => {
  let req: Partial<Request>
  let res: MockRes
  let next: jest.Mock

  beforeEach(() => {
    req = { params: { city_id: 'c1' } }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      locals: { player_id: 'p1' }
    }
    next = jest.fn()
    jest.spyOn(BuildingListQuery.prototype, 'run').mockResolvedValue(queryData as any)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('returns 400 when city_id is missing', async () => {
    req.params = {}
    await buildingListHandler(req as Request, res as unknown as Response, next as NextFunction)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ status: 'nok', error_code: 'city_id:not-found' })
  })

  it('calls next with error when query throws', async () => {
    const error = new Error('query error')
    jest.spyOn(BuildingListQuery.prototype, 'run').mockRejectedValue(error)
    await buildingListHandler(req as Request, res as unknown as Response, next as NextFunction)
    expect(next).toHaveBeenCalledWith(error)
  })

  it('returns building list on success', async () => {
    await buildingListHandler(req as Request, res as unknown as Response, next as NextFunction)
    expect(res.json).toHaveBeenCalledWith({ status: 'ok', data: queryData })
  })
})
