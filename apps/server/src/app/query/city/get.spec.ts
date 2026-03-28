import { CityGetQuery } from '#app/query/city/get'
import { AppService } from '#app/service'
import { Factory } from '#adapter/factory'
import { Repository } from '#app/port/repository/generic'
import { CityEntity } from '#core/city/entity'
import { CellEntity } from '#core/world/cell/entity'
import { CellType } from '#core/world/value/cell-type'

describe('CityGetQuery', () => {
  const player_id = 'player_id'
  let city: CityEntity
  let cell: CellEntity
  let repository: Pick<Repository, 'building' | 'city' | 'cell'>

  beforeEach(() => {
    city = CityEntity.create({
      ...CityEntity.initCity({
        name: 'dummy',
        player_id
      }),
      plastic: 30000,
      mushroom: 30000
    })
    cell = CellEntity.create({
      id: 'cell_id',
      coordinates: { x: 1, y: 2, sector: 3 },
      type: CellType.FOREST,
      resource_coefficient: { plastic: 1, mushroom: 1 },
      city_id: city.id
    })

    repository = {
      building: {
        getTotalLevels: jest.fn().mockResolvedValue(7),
      } as unknown as Repository['building'],
      city: {
        get: jest.fn().mockResolvedValue(city),
      } as unknown as Repository['city'],
      cell: {
        getCityCell: jest.fn().mockResolvedValue(cell),
      } as unknown as Repository['cell'],
    }

    jest.spyOn(Factory, 'getRepository').mockReturnValue(repository as unknown as Repository)
    jest.spyOn(AppService, 'getCityProductionBreakdown').mockResolvedValue({
      earnings_per_second: { plastic: 1, mushroom: 2 },
      pre_cell_earnings_per_second: { plastic: 1, mushroom: 2 },
      cell_resource_coefficient: { plastic: 1, mushroom: 1 }
    })
    jest.spyOn(AppService, 'getCityMaximumBuildingLevels').mockResolvedValue(42)
    jest.spyOn(AppService, 'getCityWarehousesCapacity').mockResolvedValue({
      plastic: 100,
      mushroom: 100
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('returns building_levels_used from getTotalLevels', async () => {
    const result = await new CityGetQuery().run({
      city_id: city.id,
      player_id
    })

    expect(result.building_levels_used).toBe(7)
    expect(result.maximum_building_levels).toBe(42)
    expect(repository.building.getTotalLevels).toHaveBeenCalledWith({ city_id: city.id })
  })
})
