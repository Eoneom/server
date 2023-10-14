import { CityGatherCommand } from '#app/command/city/gather'
import {
  STARTING_MUSHROOM,
  STARTING_PLASTIC
} from '#core/city/constant'
import { CityEntity } from '#core/city/entity'
import { CityError } from '#core/city/error'
import { now } from '#shared/time'
import assert from 'assert'

describe('CityGatherCommand', () => {
  const player_id = 'player_id'
  let city: CityEntity
  let command: CityGatherCommand

  beforeEach(() => {
    command = new CityGatherCommand()

    city = CityEntity.initCity({
      name: 'dummy',
      player_id
    })
  })

  it('should prevent player to gather resource in another player city', () => {
    assert.throws(() => command.exec({
      city,
      earnings_per_second: {
        plastic: 100,
        mushroom: 100
      },
      warehouses_capacity: {
        plastic: 30000,
        mushroom: 30000
      },
      player_id: 'another_player_id'
    }), new RegExp(CityError.NOT_OWNER))
  })

  it('should prevent gather if not enough time has passed', () => {
    const {
      city: updated_city,
      updated
    } = command.exec({
      city: CityEntity.create({
        ...city,
        last_plastic_gather: now() + 10 * 1000,
        last_mushroom_gather: now() + 10 * 1000
      }),
      warehouses_capacity: {
        plastic: 30000,
        mushroom: 30000
      },
      earnings_per_second: {
        plastic: 100,
        mushroom: 100
      },
      player_id
    })

    assert.strictEqual(updated, false)
    assert.strictEqual(updated_city.plastic, city.plastic)
    assert.strictEqual(updated_city.mushroom, city.mushroom)
  })

  it('should gather the maximum of what warehouses can handle', () => {
    const time_elapsed = 2
    const plastic_earnings = 100
    const mushroom_earnings = 150
    const plastic_warehouse_capacity = STARTING_PLASTIC+2
    const mushroom_warehouse_capacity = STARTING_MUSHROOM+2

    const {
      city: updated_city,
      updated
    } = command.exec({
      city: CityEntity.create({
        ...city,
        last_plastic_gather: now() - time_elapsed * 1000,
        last_mushroom_gather: now() - time_elapsed * 1000
      }),
      warehouses_capacity: {
        plastic: plastic_warehouse_capacity,
        mushroom: mushroom_warehouse_capacity
      },
      earnings_per_second: {
        plastic: plastic_earnings,
        mushroom: mushroom_earnings
      },
      player_id
    })

    assert.strictEqual(updated, true)
    assert.strictEqual(updated_city.plastic, plastic_warehouse_capacity)
    assert.strictEqual(updated_city.mushroom, mushroom_warehouse_capacity)
  })

  it('should gather city resources', () => {
    const time_elapsed = 2
    const plastic_earnings = 100
    const mushroom_earnings = 150

    const {
      city: updated_city,
      updated
    } = command.exec({
      city: CityEntity.create({
        ...city,
        last_plastic_gather: now() - time_elapsed * 1000,
        last_mushroom_gather: now() - time_elapsed * 1000
      }),
      warehouses_capacity: {
        plastic: 30000,
        mushroom: 30000
      },
      earnings_per_second: {
        plastic: plastic_earnings,
        mushroom: mushroom_earnings
      },
      player_id
    })

    assert.strictEqual(updated, true)
    assert.strictEqual(updated_city.plastic, city.plastic + time_elapsed*plastic_earnings)
    assert.strictEqual(updated_city.mushroom, city.mushroom + time_elapsed*mushroom_earnings)
  })
})
