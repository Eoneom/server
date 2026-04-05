import type { MockInstance } from 'vitest'
import { Request, Response, NextFunction } from 'express'
import { communicationCountUnreadReportHandler } from './count-unread'
import { CommunicationCountUnreadReportQuery } from '#query/communication/report/count-unread'

type MockRes = {
  status: MockInstance
  json: MockInstance
  send: MockInstance
  locals: Record<string, unknown>
}

describe('communicationCountUnreadReportHandler', () => {
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
    vi.spyOn(CommunicationCountUnreadReportQuery.prototype, 'run').mockResolvedValue({ count: 3 } as any)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('calls next with error when query throws', async () => {
    const error = new Error('query error')
    vi.spyOn(CommunicationCountUnreadReportQuery.prototype, 'run').mockRejectedValue(error)
    await communicationCountUnreadReportHandler(req as Request, res as unknown as Response, next as NextFunction)
    expect(next).toHaveBeenCalledWith(error)
  })

  it('calls next with error when player_id is not in context', async () => {
    res.locals = {}
    await communicationCountUnreadReportHandler(req as Request, res as unknown as Response, next as NextFunction)
    expect(next).toHaveBeenCalledWith(expect.any(Error))
  })

  it('returns unread count on success', async () => {
    await communicationCountUnreadReportHandler(req as Request, res as unknown as Response, next as NextFunction)
    expect(res.json).toHaveBeenCalledWith({ status: 'ok', data: { count: 3 } })
  })
})
