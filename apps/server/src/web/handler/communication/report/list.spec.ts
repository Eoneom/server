import { Request, Response, NextFunction } from 'express'
import { communicationListReportHandler } from './list'
import { CommunicationListReportQuery } from '#query/communication/report/list'

type MockRes = {
  status: jest.Mock
  json: jest.Mock
  send: jest.Mock
  locals: Record<string, unknown>
}

const report = {
  id: 'r1',
  type: 'BATTLE',
  recorded_at: '2026-03-31T10:00:00.000Z',
  was_read: false,
  origin: 'origin-coords',
  destination: 'dest-coords'
}

const queryResult = { reports: [report], total: 1 }

describe('communicationListReportHandler', () => {
  let req: Partial<Request>
  let res: MockRes
  let next: jest.Mock

  beforeEach(() => {
    req = { query: {} }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      locals: { player_id: 'p1' }
    }
    next = jest.fn()
    jest.spyOn(CommunicationListReportQuery.prototype, 'run').mockResolvedValue(queryResult as any)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('calls next with error when query throws', async () => {
    const error = new Error('query error')
    jest.spyOn(CommunicationListReportQuery.prototype, 'run').mockRejectedValue(error)
    await communicationListReportHandler(req as Request, res as unknown as Response, next as NextFunction)
    expect(next).toHaveBeenCalledWith(error)
  })

  it('calls next with error when player_id is not in context', async () => {
    res.locals = {}
    await communicationListReportHandler(req as Request, res as unknown as Response, next as NextFunction)
    expect(next).toHaveBeenCalledWith(expect.any(Error))
  })

  it('defaults to page 1 when page query param is absent', async () => {
    req.query = {}
    await communicationListReportHandler(req as Request, res as unknown as Response, next as NextFunction)
    expect(CommunicationListReportQuery.prototype.run).toHaveBeenCalledWith({ player_id: 'p1', page: 1 })
  })

  it('parses valid page query param', async () => {
    req.query = { page: '3' }
    await communicationListReportHandler(req as Request, res as unknown as Response, next as NextFunction)
    expect(CommunicationListReportQuery.prototype.run).toHaveBeenCalledWith({ player_id: 'p1', page: 3 })
  })

  it('returns mapped report list on success', async () => {
    await communicationListReportHandler(req as Request, res as unknown as Response, next as NextFunction)
    expect(res.json).toHaveBeenCalledWith({
      status: 'ok',
      data: {
        reports: [report],
        total: 1,
        page_size: 10
      }
    })
  })
})
