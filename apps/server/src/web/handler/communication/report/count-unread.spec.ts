import { Request, Response, NextFunction } from 'express'
import { communicationCountUnreadReportHandler } from './count-unread'
import { CommunicationCountUnreadReportQuery } from '#query/communication/report/count-unread'

type MockRes = {
  status: jest.Mock
  json: jest.Mock
  send: jest.Mock
  locals: Record<string, unknown>
}

describe('communicationCountUnreadReportHandler', () => {
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
    jest.spyOn(CommunicationCountUnreadReportQuery.prototype, 'run').mockResolvedValue({ count: 3 } as any)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('calls next with error when query throws', async () => {
    const error = new Error('query error')
    jest.spyOn(CommunicationCountUnreadReportQuery.prototype, 'run').mockRejectedValue(error)
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
