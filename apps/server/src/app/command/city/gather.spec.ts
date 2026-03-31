import { cityGather } from './gather'
import { Factory } from '#adapter/factory'
import { AppService } from '#app/service'
import { Repository } from '#app/port/repository/generic'
import {
  STARTING_MUSHROOM,
  STARTING_PLASTIC
} from '#core/city/constant'
import { CityEntity } from '#core/city/entity'
import { CityError } from '#core/city/error'
import { AppEvent } from '#core/events'
import { now } from '#shared/time'
import assert from 'assert'
import { testResourceStock, testCityCell } from '../../test-support/resource-stock'

describe('cityGather', () => {
  const player_id = 'player_id'
  let city: CityEntity
  let city_cell: ReturnType<typeof testCityCell>
  let stock: ReturnType<typeof testResourceStock>
  let stockUpdateOne: jest.Mock
  let mockEmit: jest.Mock
  let repository: Pick<Repository, 'city' | 'cell' | 'resource_stock'>

  beforeEach(() => {
    city = CityEntity.initCity({
      name: 'dummy',
      player_id
    })
    city_cell = testCityCell({ city_id: city.id })
    stock = testResourceStock({
      cell_id: city_cell.id,
      plastic: STARTING_PLASTIC,
      mushroom: STARTING_MUSHROOM,
      last_plastic_gather: 0,
      last_mushroom_gather: 0
    })

    stockUpdateOne = jest.fn().mockResolvedValue(undefined)
    mockEmit = jest.fn()

    repository = {
      city: {
        get: jest.fn().mockResolvedValue(city),
      } as unknown as Repository['city'],
      cell: {
        getCityCell: jest.fn().mockResolvedValue(city_cell)
      } as unknown as Repository['cell'],
      resource_stock: {
        getByCellId: jest.fn().mockImplementation(() => Promise.resolve(stock)),
        updateOne: stockUpdateOne
      } as unknown as Repository['resource_stock']
    }

    jest.spyOn(Factory, 'getRepository').mockReturnValue(repository as unknown as Repository)
    jest.spyOn(Factory, 'getEventBus').mockReturnValue({ emit: mockEmit } as any)
    jest.spyOn(AppService, 'getCityEarningsBySecond').mockResolvedValue({
      plastic: 100,
      mushroom: 100
    })
    jest.spyOn(AppService, 'getCityWarehousesCapacity').mockResolvedValue({
      plastic: 30000,
      mushroom: 30000
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should prevent player to gather resource in another player city', async () => {
    const gather_at_time = now()

    await assert.rejects(
      () => cityGather({
        city_id: city.id,
        player_id: 'another_player_id',
        gather_at_time
      }),
      new RegExp(CityError.NOT_OWNER)
    )
  })

  it('should prevent gather if not enough time has passed', async () => {
    const gather_at_time = now()
    const blocked = testResourceStock({
      cell_id: city_cell.id,
      plastic: STARTING_PLASTIC,
      mushroom: STARTING_MUSHROOM,
      last_plastic_gather: gather_at_time + 10 * 1000,
      last_mushroom_gather: gather_at_time + 10 * 1000
    })
    repository.resource_stock.getByCellId = jest.fn().mockResolvedValue(blocked)

    await cityGather({
      city_id: city.id,
      player_id,
      gather_at_time
    })

    assert.strictEqual(stockUpdateOne.mock.calls.length, 0)
  })

  it('should gather the maximum of what warehouses can handle', async () => {
    const time_elapsed = 2
    const plastic_earnings = 100
    const mushroom_earnings = 150
    const plastic_warehouse_capacity = STARTING_PLASTIC + 2
    const mushroom_warehouse_capacity = STARTING_MUSHROOM + 2
    const gather_at_time = now()

    jest.spyOn(AppService, 'getCityEarningsBySecond').mockResolvedValue({
      plastic: plastic_earnings,
      mushroom: mushroom_earnings
    })
    jest.spyOn(AppService, 'getCityWarehousesCapacity').mockResolvedValue({
      plastic: plastic_warehouse_capacity,
      mushroom: mushroom_warehouse_capacity
    })

    const seeded = testResourceStock({
      cell_id: city_cell.id,
      plastic: STARTING_PLASTIC,
      mushroom: STARTING_MUSHROOM,
      last_plastic_gather: gather_at_time - time_elapsed * 1000,
      last_mushroom_gather: gather_at_time - time_elapsed * 1000
    })
    repository.resource_stock.getByCellId = jest.fn().mockResolvedValue(seeded)

    await cityGather({
      city_id: city.id,
      player_id,
      gather_at_time
    })

    assert.strictEqual(stockUpdateOne.mock.calls.length, 1)
    const updated_stock = stockUpdateOne.mock.calls[0][0]
    assert.strictEqual(updated_stock.plastic, plastic_warehouse_capacity)
    assert.strictEqual(updated_stock.mushroom, mushroom_warehouse_capacity)
  })

  it('should gather city resources', async () => {
    const time_elapsed = 2
    const plastic_earnings = 100
    const mushroom_earnings = 150
    const gather_at_time = now()

    jest.spyOn(AppService, 'getCityEarningsBySecond').mockResolvedValue({
      plastic: plastic_earnings,
      mushroom: mushroom_earnings
    })

    const seeded = testResourceStock({
      cell_id: city_cell.id,
      plastic: STARTING_PLASTIC,
      mushroom: STARTING_MUSHROOM,
      last_plastic_gather: gather_at_time - time_elapsed * 1000,
      last_mushroom_gather: gather_at_time - time_elapsed * 1000
    })
    repository.resource_stock.getByCellId = jest.fn().mockResolvedValue(seeded)

    await cityGather({
      city_id: city.id,
      player_id,
      gather_at_time
    })

    assert.strictEqual(stockUpdateOne.mock.calls.length, 1)
    const updated_stock = stockUpdateOne.mock.calls[0][0]
    assert.strictEqual(updated_stock.plastic, STARTING_PLASTIC + time_elapsed * plastic_earnings)
    assert.strictEqual(updated_stock.mushroom, STARTING_MUSHROOM + time_elapsed * mushroom_earnings)
  })

  it('should emit CityResourcesGathered event after a successful gather', async () => {
    const time_elapsed = 2
    const gather_at_time = now()

    const seeded = testResourceStock({
      cell_id: city_cell.id,
      plastic: STARTING_PLASTIC,
      mushroom: STARTING_MUSHROOM,
      last_plastic_gather: gather_at_time - time_elapsed * 1000,
      last_mushroom_gather: gather_at_time - time_elapsed * 1000
    })
    repository.resource_stock.getByCellId = jest.fn().mockResolvedValue(seeded)

    await cityGather({
      city_id: city.id,
      player_id,
      gather_at_time
    })

    assert.strictEqual(mockEmit.mock.calls.length, 1)
    assert.strictEqual(mockEmit.mock.calls[0][0], AppEvent.CityResourcesGathered)
    assert.deepStrictEqual(mockEmit.mock.calls[0][1], { city_id: city.id, player_id })
  })

  it('should not emit event when stock is not updated (cooldown)', async () => {
    const gather_at_time = now()
    const blocked = testResourceStock({
      cell_id: city_cell.id,
      plastic: STARTING_PLASTIC,
      mushroom: STARTING_MUSHROOM,
      last_plastic_gather: gather_at_time + 10 * 1000,
      last_mushroom_gather: gather_at_time + 10 * 1000
    })
    repository.resource_stock.getByCellId = jest.fn().mockResolvedValue(blocked)

    await cityGather({
      city_id: city.id,
      player_id,
      gather_at_time
    })

    assert.strictEqual(mockEmit.mock.calls.length, 0)
  })
})
