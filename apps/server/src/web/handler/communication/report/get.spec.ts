import { Request, Response, NextFunction } from 'express'
import { communicationGetReportHandler } from './get'
import { CommunicationGetReportQuery } from '#query/communication/report/get'

type MockRes = {
  status: jest.Mock
  json: jest.Mock
  send: jest.Mock
  locals: Record<string, unknown>
}

const queryResult = {
  report: {
    id: 'r1',
    type: 'BATTLE',
    destination: 'dest-coords',
    origin: 'origin-coords',
    recorded_at: '2026-03-31T10:00:00.000Z',
    was_read: false,
    troops: [{ code: 'WARRIOR', count: 5 }]
  }
}

describe('communicationGetReportHandler', () => {
  let req: Partial<Request>
  let res: MockRes
  let next: jest.Mock

  beforeEach(() => {
    req = { params: { report_id: 'r1' } }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      locals: { player_id: 'p1' }
    }
    next = jest.fn()
    jest.spyOn(CommunicationGetReportQuery.prototype, 'run').mockResolvedValue(queryResult as any)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('returns 400 when report_id is missing', async () => {
    req.params = {}
    await communicationGetReportHandler(req as Request, res as unknown as Response, next as NextFunction)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ status: 'nok', error_code: 'report_id:not-found' })
  })

  it('calls next with error when query throws', async () => {
    const error = new Error('query error')
    jest.spyOn(CommunicationGetReportQuery.prototype, 'run').mockRejectedValue(error)
    await communicationGetReportHandler(req as Request, res as unknown as Response, next as NextFunction)
    expect(next).toHaveBeenCalledWith(error)
  })

  it('returns mapped report on success', async () => {
    await communicationGetReportHandler(req as Request, res as unknown as Response, next as NextFunction)
    expect(res.json).toHaveBeenCalledWith({
      status: 'ok',
      data: {
        id: 'r1',
        type: 'BATTLE',
        destination: 'dest-coords',
        origin: 'origin-coords',
        recorded_at: '2026-03-31T10:00:00.000Z',
        was_read: false,
        troops: [{ code: 'WARRIOR', count: 5 }]
      }
    })
  })
})
