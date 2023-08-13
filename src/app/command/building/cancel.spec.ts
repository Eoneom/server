import { BuildingCancelCommand } from '#app/command/building/cancel'
import { BuildingEntity } from '#core/building/entity'
import { BuildingErrors } from '#core/building/errors'
import { CityEntity } from '#core/city/entity'
import { CityErrors } from '#core/city/errors'
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
      ...BuildingEntity.initMushroomFarm({ city_id: city.id }),
      upgrade_at: now() + 1000 * 60
    })
  })

  it('should prevent player from cancelling other player buildings', () => {
    assert.throws(() => command.exec({
      player_id: another_player_id,
      city,
      building
    }), new RegExp(CityErrors.NOT_OWNER))
  })

  it('should assert that there is a building in progress', () => {
    assert.throws(() => command.exec({
      player_id,
      city,
      building: null
    }), new RegExp(BuildingErrors.NOT_IN_PROGRESS))
  })

  it('should refund half of the building price when building is cancelled', () => {
    const { city: updated_city } = command.exec({
      city,
      player_id,
      building
    })

    assert.strictEqual(updated_city.plastic, city.plastic + 77)
    assert.strictEqual(updated_city.mushroom, city.mushroom + 134)
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
