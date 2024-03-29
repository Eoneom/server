import { BuildingCancelCommand } from '#app/command/building/cancel'
import { BuildingCode } from '#core/building/constant/code'
import { BuildingEntity } from '#core/building/entity'
import { BuildingError } from '#core/building/error'
import { CityEntity } from '#core/city/entity'
import { CityError } from '#core/city/error'
import { now } from '#shared/time'
import assert from 'assert'

describe('BuildingCancelCommand', () => {
  const player_id = 'player_id'
  const another_player_id = 'another_player_id'
  let city: CityEntity
  let command: BuildingCancelCommand
  let building: BuildingEntity

  beforeEach(() => {
    city = CityEntity.initCity({
      name: 'dummy',
      player_id
    })

    command = new BuildingCancelCommand()
    building = BuildingEntity.create({
      id: 'building_id',
      code: BuildingCode.MUSHROOM_FARM,
      level: 0,
      city_id: city.id,
      upgrade_at: now() + 1000 * 60
    })
  })

  it('should prevent player from cancelling other player buildings', () => {
    assert.throws(() => command.exec({
      player_id: another_player_id,
      city,
      building
    }), new RegExp(CityError.NOT_OWNER))
  })

  it('should assert that there is a building in progress', () => {
    assert.throws(() => command.exec({
      player_id,
      city,
      building: null
    }), new RegExp(BuildingError.NOT_IN_PROGRESS))
  })

  it('should refund half of the building price when building is cancelled', () => {
    const { city: updated_city } = command.exec({
      city,
      player_id,
      building
    })

    assert.strictEqual(updated_city.plastic, city.plastic + 39)
    assert.strictEqual(updated_city.mushroom, city.mushroom + 67)
  })

  it('should cancel building', () => {
    const { building: updated_building } = command.exec({
      city,
      player_id,
      building
    })

    assert.ok(building.upgrade_at)
    assert.ok(!updated_building.upgrade_at)
  })
})
