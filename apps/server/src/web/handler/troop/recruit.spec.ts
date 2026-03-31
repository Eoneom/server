import { Request, Response, NextFunction } from 'express'
import { troopRecruitHandler } from './recruit'
import { sagaRecruitTroop } from '#app/saga/troop-recruit'

jest.mock('#app/saga/troop-recruit')

type MockRes = {
  status: jest.Mock
  json: jest.Mock
  send: jest.Mock
  locals: Record<string, unknown>
}

describe('troopRecruitHandler', () => {
  let req: Partial<Request>
  let res: MockRes
  let next: jest.Mock

  beforeEach(() => {
    req = { body: { city_id: 'c1', count: 10, troop_code: 'WARRIOR' } }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      locals: { player_id: 'p1' }
    }
    next = jest.fn()
    ;(sagaRecruitTroop as jest.Mock).mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('returns 400 when city_id is missing', async () => {
    req.body = { count: 10, troop_code: 'WARRIOR' }
    await troopRecruitHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ status: 'nok', error_code: 'city_id:not-found' })
  })

  it('returns 400 when count is missing', async () => {
    req.body = { city_id: 'c1', troop_code: 'WARRIOR' }
    await troopRecruitHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ status: 'nok', error_code: 'count:not-found' })
  })

  it('returns 400 when troop_code is missing', async () => {
    req.body = { city_id: 'c1', count: 10 }
    await troopRecruitHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ status: 'nok', error_code: 'troop_code:not-found' })
  })

  it('calls next with error when saga throws', async () => {
    const error = new Error('recruit error')
    ;(sagaRecruitTroop as jest.Mock).mockRejectedValue(error)
    await troopRecruitHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(next).toHaveBeenCalledWith(error)
  })

  it('calls saga with correct args and returns ok', async () => {
    await troopRecruitHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(sagaRecruitTroop).toHaveBeenCalledWith({ city_id: 'c1', count: 10, player_id: 'p1', troop_code: 'WARRIOR' })
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ status: 'ok' })
  })
})
