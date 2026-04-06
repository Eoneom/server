import {
  vi, type MockInstance 
} from 'vitest'
import {
  Request, Response, NextFunction 
} from 'express'
import { gameRefreshStateHandler } from './refresh-state'
import { sagaRefreshGameState } from '#app/saga/game/refresh-state'

vi.mock('#app/saga/game/refresh-state')

type MockRes = {
  status: MockInstance
  json: MockInstance
  send: MockInstance
  locals: Record<string, unknown>
}

describe('gameRefreshStateHandler', () => {
  let req: Partial<Request>
  let res: MockRes
  let next: MockInstance

  beforeEach(() => {
    req = { body: { city_id: 'c1' } }
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
      locals: { player_id: 'p1' }
    }
    next = vi.fn()
    ;(sagaRefreshGameState as MockInstance).mockResolvedValue(undefined)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns 400 when city_id is missing', async () => {
    req.body = {}
    await gameRefreshStateHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      status: 'nok',
      error_code: 'city_id:not-found' 
    })
  })

  it('calls next with error when player_id is not in context', async () => {
    res.locals = {}
    await gameRefreshStateHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(next).toHaveBeenCalledWith(expect.any(Error))
  })

  it('fires saga with correct args and returns ok', async () => {
    await gameRefreshStateHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(sagaRefreshGameState).toHaveBeenCalledWith({
      city_id: 'c1',
      player_id: 'p1' 
    })
    expect(res.json).toHaveBeenCalledWith({ status: 'ok' })
  })
})
