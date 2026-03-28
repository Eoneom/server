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
import { now } from '#shared/time'
import assert from 'assert'

describe('cityGather', () => {
  const player_id = 'player_id'
  let city: CityEntity
  let cityUpdateOne: jest.Mock
  let repository: Pick<Repository, 'city'>

  beforeEach(() => {
    city = CityEntity.initCity({
      name: 'dummy',
      player_id
    })

    cityUpdateOne = jest.fn().mockResolvedValue(undefined)

    repository = {
      city: {
        get: jest.fn().mockResolvedValue(city),
        updateOne: cityUpdateOne
      } as unknown as Repository['city']
    }

    jest.spyOn(Factory, 'getRepository').mockReturnValue(repository as unknown as Repository)
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

    repository.city.get = jest.fn().mockResolvedValue(
      CityEntity.create({
        ...city,
        last_plastic_gather: gather_at_time + 10 * 1000,
        last_mushroom_gather: gather_at_time + 10 * 1000
      })
    )

    await cityGather({
      city_id: city.id,
      player_id,
      gather_at_time
    })

    assert.strictEqual(cityUpdateOne.mock.calls.length, 0)
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

    repository.city.get = jest.fn().mockResolvedValue(
      CityEntity.create({
        ...city,
        last_plastic_gather: gather_at_time - time_elapsed * 1000,
        last_mushroom_gather: gather_at_time - time_elapsed * 1000
      })
    )

    await cityGather({
      city_id: city.id,
      player_id,
      gather_at_time
    })

    assert.strictEqual(cityUpdateOne.mock.calls.length, 1)
    const updated_city = cityUpdateOne.mock.calls[0][0]
    assert.strictEqual(updated_city.plastic, plastic_warehouse_capacity)
    assert.strictEqual(updated_city.mushroom, mushroom_warehouse_capacity)
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

    repository.city.get = jest.fn().mockResolvedValue(
      CityEntity.create({
        ...city,
        last_plastic_gather: gather_at_time - time_elapsed * 1000,
        last_mushroom_gather: gather_at_time - time_elapsed * 1000
      })
    )

    await cityGather({
      city_id: city.id,
      player_id,
      gather_at_time
    })

    assert.strictEqual(cityUpdateOne.mock.calls.length, 1)
    const updated_city = cityUpdateOne.mock.calls[0][0]
    assert.strictEqual(updated_city.plastic, city.plastic + time_elapsed * plastic_earnings)
    assert.strictEqual(updated_city.mushroom, city.mushroom + time_elapsed * mushroom_earnings)
  })
})
