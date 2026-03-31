import { Request, Response, NextFunction } from 'express'
import { cityGetHandler } from './get'
import { CityGetQuery } from '#query/city/get'

type MockRes = {
  status: jest.Mock
  json: jest.Mock
  send: jest.Mock
  locals: Record<string, unknown>
}

const queryResult = {
  city: { id: 'c1', name: 'Aliceton' },
  maximum_building_levels: 10,
  building_levels_used: 3,
  earnings_per_second: { plastic: 1.5, mushroom: 2.0 },
  pre_cell_earnings_per_second: { plastic: 1.0, mushroom: 1.5 },
  cell_resource_coefficient: { plastic: 1.2, mushroom: 1.0 },
  cell: { coordinates: { x: 1, y: 2, sector: 0 } },
  resource_stock: { plastic: 500, mushroom: 300 },
  warehouses_capacity: { plastic: 2000, mushroom: 2000 },
  warehouse_space_remaining: { plastic: 1500, mushroom: 1700 },
  warehouse_full_in_seconds: { plastic: 1000, mushroom: 850 }
}

describe('cityGetHandler', () => {
  let req: Partial<Request>
  let res: MockRes
  let next: jest.Mock

  beforeEach(() => {
    req = { params: { city_id: 'c1' } }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      locals: { player_id: 'p1' }
    }
    next = jest.fn()
    jest.spyOn(CityGetQuery.prototype, 'run').mockResolvedValue(queryResult as any)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('returns 400 when city_id is missing', async () => {
    req.params = {}
    await cityGetHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ status: 'nok', error_code: 'city_id:not-found' })
  })

  it('calls next with error when query throws', async () => {
    const error = new Error('query error')
    jest.spyOn(CityGetQuery.prototype, 'run').mockRejectedValue(error)
    await cityGetHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(next).toHaveBeenCalledWith(error)
  })

  it('returns city data on success', async () => {
    await cityGetHandler(req as unknown as Request, res as unknown as Response, next as NextFunction)
    expect(res.json).toHaveBeenCalledWith({
      status: 'ok',
      data: {
        id: 'c1',
        name: 'Aliceton',
        plastic: 500,
        mushroom: 300,
        maximum_building_levels: 10,
        building_levels_used: 3,
        earnings_per_second: { plastic: 1.5, mushroom: 2.0 },
        pre_cell_earnings_per_second: { plastic: 1.0, mushroom: 1.5 },
        cell_resource_coefficient: { plastic: 1.2, mushroom: 1.0 },
        warehouses_capacity: { plastic: 2000, mushroom: 2000 },
        warehouse_space_remaining: { plastic: 1500, mushroom: 1700 },
        warehouse_full_in_seconds: { plastic: 1000, mushroom: 850 },
        coordinates: { x: 1, y: 2, sector: 0 }
      }
    })
  })
})
