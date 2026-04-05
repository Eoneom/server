import { vi, type MockInstance } from 'vitest'
import { Request, Response, NextFunction } from 'express'
import { troopProgressRecruitHandler } from './progress-recruit'
import { progressTroopRecruitment } from '#app/command/troop/progress-recruit'

vi.mock('#app/command/troop/progress-recruit')

type MockRes = {
  status: MockInstance
  json: MockInstance
  send: MockInstance
  locals: Record<string, unknown>
}

describe('troopProgressRecruitHandler', () => {
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
    vi.mocked(progressTroopRecruitment).mockResolvedValue({ recruit_count: 5 })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns 400 when city_id is missing', async () => {
    req.body = {}
    await troopProgressRecruitHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ status: 'nok', error_code: 'city_id:not-found' })
  })

  it('calls next with error when command throws', async () => {
    const error = new Error('recruit error')
    vi.mocked(progressTroopRecruitment).mockRejectedValue(error)
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
