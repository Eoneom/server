import { vi, type MockInstance } from 'vitest'
import { Request, Response, NextFunction } from 'express'
import { technologyFinishResearchHandler } from './finish-research'
import { finishTechnologyResearch } from '#app/command/technology/finish-research'

vi.mock('#app/command/technology/finish-research')

type MockRes = {
  status: MockInstance
  json: MockInstance
  send: MockInstance
  locals: Record<string, unknown>
}

describe('technologyFinishResearchHandler', () => {
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
    ;(finishTechnologyResearch as MockInstance).mockResolvedValue(undefined)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('calls next with error when player_id is not in context', async () => {
    res.locals = {}
    await technologyFinishResearchHandler(req as Request, res as unknown as Response, next as NextFunction)
    expect(next).toHaveBeenCalledWith(expect.any(Error))
  })

  it('fires command with correct args and returns ok', async () => {
    await technologyFinishResearchHandler(req as Request, res as unknown as Response, next as NextFunction)
    expect(finishTechnologyResearch).toHaveBeenCalledWith({ player_id: 'p1' })
    expect(res.json).toHaveBeenCalledWith({ status: 'ok' })
  })
})
