import {
  vi, type MockInstance 
} from 'vitest'
import {
  Request, Response, NextFunction 
} from 'express'
import { logoutHandler } from './logout'
import { logoutAuth } from '#command/auth/logout'

vi.mock('#command/auth/logout')

type MockRes = {
  status: MockInstance
  json: MockInstance
  send: MockInstance
  locals: Record<string, unknown>
}

describe('logoutHandler', () => {
  let req: Partial<Request>
  let res: MockRes
  let next: MockInstance

  beforeEach(() => {
    req = { headers: { authorization: 'Bearer token123' } }
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
      locals: {}
    }
    next = vi.fn()
    ;(logoutAuth as MockInstance).mockResolvedValue(undefined)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('rejects when authorization header is missing', async () => {
    req.headers = {}
    await expect(logoutHandler(req as Request, res as unknown as Response, next as NextFunction)).rejects.toThrow()
  })

  it('calls next with error when logoutAuth throws', async () => {
    const error = new Error('logout error')
    ;(logoutAuth as MockInstance).mockRejectedValue(error)
    await logoutHandler(req as Request, res as unknown as Response, next as NextFunction)
    expect(next).toHaveBeenCalledWith(error)
  })

  it('returns ok on success', async () => {
    await logoutHandler(req as Request, res as unknown as Response, next as NextFunction)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.send).toHaveBeenCalledWith({ status: 'ok' })
  })
})
