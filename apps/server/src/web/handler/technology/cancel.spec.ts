import { Request, Response, NextFunction } from 'express'
import { technologyCancelHandler } from './cancel'
import { cancelTechnology } from '#command/technology/cancel'

jest.mock('#command/technology/cancel')

type MockRes = {
  status: jest.Mock
  json: jest.Mock
  send: jest.Mock
  locals: Record<string, unknown>
}

describe('technologyCancelHandler', () => {
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
    ;(cancelTechnology as jest.Mock).mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('calls next with error when command throws', async () => {
    const error = new Error('cancel error')
    ;(cancelTechnology as jest.Mock).mockRejectedValue(error)
    await technologyCancelHandler(req as Request, res as unknown as Response, next as NextFunction)
    expect(next).toHaveBeenCalledWith(error)
  })

  it('calls next with error when player_id is not in context', async () => {
    res.locals = {}
    await technologyCancelHandler(req as Request, res as unknown as Response, next as NextFunction)
    expect(next).toHaveBeenCalledWith(expect.any(Error))
  })

  it('calls command with player_id and returns ok', async () => {
    await technologyCancelHandler(req as Request, res as unknown as Response, next as NextFunction)
    expect(cancelTechnology).toHaveBeenCalledWith({ player_id: 'p1' })
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ status: 'ok' })
  })
})
