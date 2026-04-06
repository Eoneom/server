import {
  vi, type MockInstance 
} from 'vitest'
import {
  Request, Response, NextFunction 
} from 'express'
import { troopFinishMovementHandler } from './finish'
import { sagaFinishMovement } from '#app/saga/finish/movement'

vi.mock('#app/saga/finish/movement')

type MockRes = {
  status: MockInstance
  json: MockInstance
  send: MockInstance
  locals: Record<string, unknown>
}

describe('troopFinishMovementHandler', () => {
  let req: Partial<Request>
  let res: MockRes
  let next: MockInstance

  beforeEach(() => {
    req = {}
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
      locals: { player_id: 'p1' }
    }
    next = vi.fn()
    ;(sagaFinishMovement as MockInstance).mockResolvedValue(undefined)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('calls next with error when player_id is not in context', async () => {
    res.locals = {}
    await troopFinishMovementHandler(req as Request, res as unknown as Response, next as NextFunction)
    expect(next).toHaveBeenCalledWith(expect.any(Error))
  })

  it('fires saga with correct args and returns ok', async () => {
    await troopFinishMovementHandler(req as Request, res as unknown as Response, next as NextFunction)
    expect(sagaFinishMovement).toHaveBeenCalledWith({ player_id: 'p1' })
    expect(res.json).toHaveBeenCalledWith({ status: 'ok' })
  })
})
