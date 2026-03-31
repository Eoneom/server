import { Request, Response, NextFunction } from 'express'
import { technologyListHandler } from './list'
import { TechnologyListQuery } from '#query/technology/list'

type MockRes = {
  status: jest.Mock
  json: jest.Mock
  send: jest.Mock
  locals: Record<string, unknown>
}

const queryResult = {
  technologies: [
    { id: 't1', code: 'ARCHERY', level: 2, research_at: null, research_started_at: null },
    {
      id: 't2',
      code: 'METALLURGY',
      level: 1,
      research_at: '2026-01-01T00:00:00.000Z',
      research_started_at: '2025-12-31T00:00:00.000Z'
    }
  ]
}

describe('technologyListHandler', () => {
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
    jest.spyOn(TechnologyListQuery.prototype, 'run').mockResolvedValue(queryResult as any)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('calls next with error when query throws', async () => {
    const error = new Error('query error')
    jest.spyOn(TechnologyListQuery.prototype, 'run').mockRejectedValue(error)
    await technologyListHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(next).toHaveBeenCalledWith(error)
  })

  it('calls next with error when player_id is not in context', async () => {
    res.locals = {}
    await technologyListHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(next).toHaveBeenCalledWith(expect.any(Error))
  })

  it('returns technology list on success', async () => {
    await technologyListHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(res.json).toHaveBeenCalledWith({
      status: 'ok',
      data: {
        technologies: [
          { id: 't1', code: 'ARCHERY', level: 2 },
          {
            id: 't2',
            code: 'METALLURGY',
            level: 1,
            research_at: '2026-01-01T00:00:00.000Z',
            research_started_at: '2025-12-31T00:00:00.000Z'
          }
        ]
      }
    })
  })
})
