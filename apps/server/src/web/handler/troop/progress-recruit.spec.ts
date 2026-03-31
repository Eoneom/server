import { Request, Response, NextFunction } from 'express'
import { troopProgressRecruitHandler } from './progress-recruit'
import { progressTroopRecruitment } from '#app/command/troop/progress-recruit'

jest.mock('#app/command/troop/progress-recruit')

type MockRes = {
  status: jest.Mock
  json: jest.Mock
  send: jest.Mock
  locals: Record<string, unknown>
}

describe('troopProgressRecruitHandler', () => {
  let req: Partial<Request>
  let res: MockRes
  let next: jest.Mock

  beforeEach(() => {
    req = { body: { city_id: 'c1' } }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      locals: { player_id: 'p1' }
    }
    next = jest.fn()
    jest.mocked(progressTroopRecruitment).mockResolvedValue({ recruit_count: 5 })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('returns 400 when city_id is missing', async () => {
    req.body = {}
    await troopProgressRecruitHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ status: 'nok', error_code: 'city_id:not-found' })
  })

  it('calls next with error when command throws', async () => {
    const error = new Error('recruit error')
    jest.mocked(progressTroopRecruitment).mockRejectedValue(error)
    await troopProgressRecruitHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(next).toHaveBeenCalledWith(error)
  })

  it('calls command with correct args and returns recruit_count', async () => {
    await troopProgressRecruitHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(progressTroopRecruitment).toHaveBeenCalledWith({ city_id: 'c1', player_id: 'p1' })
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ status: 'ok', data: { recruit_count: 5 } })
  })
})
