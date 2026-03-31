import { Request, Response, NextFunction } from 'express'
import { buildingCancelHandler } from './cancel'
import { cancelBuilding } from '#command/building/cancel'

jest.mock('#command/building/cancel')

type MockRes = {
  status: jest.Mock
  json: jest.Mock
  send: jest.Mock
  locals: Record<string, unknown>
}

describe('buildingCancelHandler', () => {
  let req: Partial<Request>
  let res: MockRes
  let next: jest.Mock

  beforeEach(() => {
    req = { body: { city_id: 'c1' } }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      locals: { player_id: 'p1' }
    }
    next = jest.fn()
    ;(cancelBuilding as jest.Mock).mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('returns 400 when city_id is missing', async () => {
    req.body = {}
    await buildingCancelHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ status: 'nok', error_code: 'city_id:not-found' })
  })

  it('calls next with error when cancelBuilding throws', async () => {
    const error = new Error('cancel error')
    ;(cancelBuilding as jest.Mock).mockRejectedValue(error)
    await buildingCancelHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(next).toHaveBeenCalledWith(error)
  })

  it('returns ok on success', async () => {
    await buildingCancelHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(cancelBuilding).toHaveBeenCalledWith({ player_id: 'p1', city_id: 'c1' })
    expect(res.json).toHaveBeenCalledWith({ status: 'ok' })
  })
})
