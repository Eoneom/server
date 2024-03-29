import { BuildingFinishUpgradeCommand } from '#app/command/building/finish-upgrade'
import { BuildingCode } from '#core/building/constant/code'
import { BuildingEntity } from '#core/building/entity'
import { BuildingError } from '#core/building/error'
import { CityEntity } from '#core/city/entity'
import { CityError } from '#core/city/error'
import { now } from '#shared/time'
import assert from 'assert'

describe('BuildingFinishUpgradeCommand', () => {
  const player_id = 'player_id'
  let command: BuildingFinishUpgradeCommand
  let city: CityEntity
  let building_to_finish: BuildingEntity

  beforeEach(() => {
    command = new BuildingFinishUpgradeCommand()
    city = CityEntity.create({
      ...CityEntity.initCity({
        name: 'dummy',
        player_id
      }),
      plastic: 1000,
      mushroom: 1000
    })
    building_to_finish = BuildingEntity.create({
      id: 'building_id',
      level: 0,
      code: BuildingCode.MUSHROOM_FARM,
      city_id: city.id,
      upgrade_at: now()
    })
  })

  it('should prevent a player to upgrade building in another player city', () => {
    assert.throws(() => command.exec({
      city,
      building_to_finish,
      player_id: 'another_player_id'
    }), new RegExp(CityError.NOT_OWNER))
  })

  it('should not return any update if there is no building in progress', () => {
    const { building: updated_building } = command.exec({
      city,
      building_to_finish: null,
      player_id
    })

    assert.ok(!updated_building)
  })

  it('should finish the building upgrade', () => {
    const { building: updated_building } = command.exec({
      city,
      building_to_finish,
      player_id
    })

    assert.ok(building_to_finish.upgrade_at)
    assert.ok(updated_building)
    assert.ok(!updated_building.upgrade_at)
  })
})
