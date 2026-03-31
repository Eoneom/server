import { Request, Response, NextFunction } from 'express'
import { citySettleHandler } from './settle'
import { citySettle } from '#app/command/city/settle'

jest.mock('#app/command/city/settle')

type MockRes = {
  status: jest.Mock
  json: jest.Mock
  send: jest.Mock
  locals: Record<string, unknown>
}

describe('citySettleHandler', () => {
  let req: Partial<Request>
  let res: MockRes
  let next: jest.Mock

  beforeEach(() => {
    req = { body: { outpost_id: 'o1', city_name: 'New City' } }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      locals: { player_id: 'p1' }
    }
    next = jest.fn()
    jest.mocked(citySettle).mockResolvedValue({ city_id: 'new-city' })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('returns 400 when outpost_id is missing', async () => {
    req.body = { city_name: 'New City' }
    await citySettleHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ status: 'nok', error_code: 'outpost_id:not-found' })
  })

  it('returns 400 when city_name is missing', async () => {
    req.body = { outpost_id: 'o1' }
    await citySettleHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ status: 'nok', error_code: 'city_name:not-found' })
  })

  it('calls next with error when command throws', async () => {
    const error = new Error('settle error')
    jest.mocked(citySettle).mockRejectedValue(error)
    await citySettleHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(next).toHaveBeenCalledWith(error)
  })

  it('returns city_id on success', async () => {
    await citySettleHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(citySettle).toHaveBeenCalledWith({ outpost_id: 'o1', player_id: 'p1', city_name: 'New City' })
    expect(res.json).toHaveBeenCalledWith({ status: 'ok', data: { city_id: 'new-city' } })
  })
})
