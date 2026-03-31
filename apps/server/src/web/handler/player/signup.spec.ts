import { Request, Response, NextFunction } from 'express'
import { signupHandler } from './signup'
import { signupAuth } from '#command/auth/signup'

jest.mock('#command/auth/signup')

type MockRes = {
  status: jest.Mock
  json: jest.Mock
  send: jest.Mock
  locals: Record<string, unknown>
}

describe('signupHandler', () => {
  let req: Partial<Request>
  let res: MockRes
  let next: jest.Mock

  beforeEach(() => {
    req = { body: { player_name: 'alice', city_name: 'Aliceton' } }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      locals: {}
    }
    next = jest.fn()
    jest.mocked(signupAuth).mockResolvedValue({ player_id: 'p1', city_id: 'c1' })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('returns 400 when player_name is missing', async () => {
    req.body = { city_name: 'Aliceton' }
    await signupHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ status: 'nok', error_code: 'player_name:not-found' })
  })

  it('returns 400 when city_name is missing', async () => {
    req.body = { player_name: 'alice' }
    await signupHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ status: 'nok', error_code: 'city_name:not-found' })
  })

  it('calls next with error when signupAuth throws', async () => {
    const error = new Error('signup error')
    jest.mocked(signupAuth).mockRejectedValue(error)
    await signupHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(next).toHaveBeenCalledWith(error)
  })

  it('returns player_id and city_id on success', async () => {
    await signupHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.send).toHaveBeenCalledWith({ status: 'ok', data: { player_id: 'p1', city_id: 'c1' } })
  })
})
