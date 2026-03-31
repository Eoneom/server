import { Request, Response, NextFunction } from 'express'
import { technologyFinishResearchHandler } from './finish-research'
import { finishTechnologyResearch } from '#app/command/technology/finish-research'

jest.mock('#app/command/technology/finish-research')

type MockRes = {
  status: jest.Mock
  json: jest.Mock
  send: jest.Mock
  locals: Record<string, unknown>
}

describe('technologyFinishResearchHandler', () => {
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
    ;(finishTechnologyResearch as jest.Mock).mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.restoreAllMocks()
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
