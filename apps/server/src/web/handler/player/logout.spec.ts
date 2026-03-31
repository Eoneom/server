import { Request, Response, NextFunction } from 'express'
import { logoutHandler } from './logout'
import { logoutAuth } from '#command/auth/logout'

jest.mock('#command/auth/logout')

type MockRes = {
  status: jest.Mock
  json: jest.Mock
  send: jest.Mock
  locals: Record<string, unknown>
}

describe('logoutHandler', () => {
  let req: Partial<Request>
  let res: MockRes
  let next: jest.Mock

  beforeEach(() => {
    req = { headers: { authorization: 'Bearer token123' } }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      locals: {}
    }
    next = jest.fn()
    ;(logoutAuth as jest.Mock).mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('rejects when authorization header is missing', async () => {
    req.headers = {}
    await expect(
      logoutHandler(req as Request, res as unknown as Response, next as NextFunction)
    ).rejects.toThrow()
  })

  it('calls next with error when logoutAuth throws', async () => {
    const error = new Error('logout error')
    ;(logoutAuth as jest.Mock).mockRejectedValue(error)
    await logoutHandler(req as Request, res as unknown as Response, next as NextFunction)
    expect(next).toHaveBeenCalledWith(error)
  })

  it('returns ok on success', async () => {
    await logoutHandler(req as Request, res as unknown as Response, next as NextFunction)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.send).toHaveBeenCalledWith({ status: 'ok' })
  })
})
