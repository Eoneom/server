import { Request, Response, NextFunction } from 'express'
import { troopFinishMovementHandler } from './finish'
import { sagaFinishMovement } from '#app/saga/finish/movement'

jest.mock('#app/saga/finish/movement')

type MockRes = {
  status: jest.Mock
  json: jest.Mock
  send: jest.Mock
  locals: Record<string, unknown>
}

describe('troopFinishMovementHandler', () => {
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
    ;(sagaFinishMovement as jest.Mock).mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.restoreAllMocks()
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
