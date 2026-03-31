import { Request, Response, NextFunction } from 'express'
import { technologyResearchHandler } from './research'
import { sagaResearchTechnology } from '#app/saga/research-technology'

jest.mock('#app/saga/research-technology')

type MockRes = {
  status: jest.Mock
  json: jest.Mock
  send: jest.Mock
  locals: Record<string, unknown>
}

describe('technologyResearchHandler', () => {
  let req: Partial<Request>
  let res: MockRes
  let next: jest.Mock

  beforeEach(() => {
    req = { body: { city_id: 'c1', technology_code: 'ARCHERY' } }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      locals: { player_id: 'p1' }
    }
    next = jest.fn()
    ;(sagaResearchTechnology as jest.Mock).mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('returns 400 when city_id is missing', async () => {
    req.body = { technology_code: 'ARCHERY' }
    await technologyResearchHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ status: 'nok', error_code: 'city_id:not-found' })
  })

  it('returns 400 when technology_code is missing', async () => {
    req.body = { city_id: 'c1' }
    await technologyResearchHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ status: 'nok', error_code: 'technology_code:not-found' })
  })

  it('calls next with error when saga throws', async () => {
    const error = new Error('research error')
    ;(sagaResearchTechnology as jest.Mock).mockRejectedValue(error)
    await technologyResearchHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(next).toHaveBeenCalledWith(error)
  })

  it('calls saga with correct args and returns ok', async () => {
    await technologyResearchHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(sagaResearchTechnology).toHaveBeenCalledWith({ city_id: 'c1', player_id: 'p1', technology_code: 'ARCHERY' })
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ status: 'ok' })
  })
})
