import { Request, Response, NextFunction } from 'express'
import { outpostSetPermanentHandler } from './set-permanent'
import { outpostSetPermanent } from '#app/command/outpost/set-permanent'

jest.mock('#app/command/outpost/set-permanent')

type MockRes = {
  status: jest.Mock
  json: jest.Mock
  send: jest.Mock
  locals: Record<string, unknown>
}

describe('outpostSetPermanentHandler', () => {
  let req: Partial<Request>
  let res: MockRes
  let next: jest.Mock

  beforeEach(() => {
    req = { body: { outpost_id: 'o1' } }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      locals: { player_id: 'p1' }
    }
    next = jest.fn()
    ;(outpostSetPermanent as jest.Mock).mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('returns 400 when outpost_id is missing', async () => {
    req.body = {}
    await outpostSetPermanentHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ status: 'nok', error_code: 'outpost_id:not-found' })
  })

  it('calls next with error when command throws', async () => {
    const error = new Error('command error')
    ;(outpostSetPermanent as jest.Mock).mockRejectedValue(error)
    await outpostSetPermanentHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(next).toHaveBeenCalledWith(error)
  })

  it('calls command with correct args and returns ok', async () => {
    await outpostSetPermanentHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(outpostSetPermanent).toHaveBeenCalledWith({ outpost_id: 'o1', player_id: 'p1' })
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ status: 'ok' })
  })
})
