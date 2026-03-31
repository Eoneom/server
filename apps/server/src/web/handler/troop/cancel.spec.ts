import { Request, Response, NextFunction } from 'express'
import { troopCancelHandler } from './cancel'
import { cancelTroop } from '#app/command/troop/cancel'

jest.mock('#app/command/troop/cancel')

type MockRes = {
  status: jest.Mock
  json: jest.Mock
  send: jest.Mock
  locals: Record<string, unknown>
}

describe('troopCancelHandler', () => {
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
    ;(cancelTroop as jest.Mock).mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('returns 400 when city_id is missing', async () => {
    req.body = {}
    await troopCancelHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ status: 'nok', error_code: 'city_id:not-found' })
  })

  it('calls next with error when command throws', async () => {
    const error = new Error('cancel error')
    ;(cancelTroop as jest.Mock).mockRejectedValue(error)
    await troopCancelHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(next).toHaveBeenCalledWith(error)
  })

  it('calls command with correct args and returns ok', async () => {
    await troopCancelHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(cancelTroop).toHaveBeenCalledWith({ player_id: 'p1', city_id: 'c1' })
    expect(res.json).toHaveBeenCalledWith({ status: 'ok' })
  })
})
