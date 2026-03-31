import { Request, Response, NextFunction } from 'express'
import { loginHandler } from './login'
import { loginAuth } from '#command/auth/login'

jest.mock('#command/auth/login')

type MockRes = {
  status: jest.Mock
  json: jest.Mock
  send: jest.Mock
  locals: Record<string, unknown>
}

describe('loginHandler', () => {
  let req: Partial<Request>
  let res: MockRes
  let next: jest.Mock

  beforeEach(() => {
    req = { body: { player_name: 'alice' } }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      locals: {}
    }
    next = jest.fn()
    jest.mocked(loginAuth).mockResolvedValue({ token: 'tok123' })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('returns 400 when player_name is missing', async () => {
    req.body = {}
    await loginHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ status: 'nok', error_code: 'player_name:not-found' })
  })

  it('calls next with error when loginAuth throws', async () => {
    const error = new Error('auth error')
    jest.mocked(loginAuth).mockRejectedValue(error)
    await loginHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(next).toHaveBeenCalledWith(error)
  })

  it('returns token on success', async () => {
    await loginHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.send).toHaveBeenCalledWith({ status: 'ok', data: { token: 'tok123' } })
  })
})
