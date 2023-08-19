import { BuildingFinishUpgradeCommand } from '#app/command/building/finish-upgrade'
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
      ...BuildingEntity.initMushroomFarm({ city_id: city.id }),
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

  it('should prevent a upgrade if there is no building in progress', () => {
    assert.throws(() => command.exec({
      city,
      building_to_finish: null,
      player_id
    }), new RegExp(BuildingError.NOT_IN_PROGRESS))
  })

  it('should finish the  building upgrade', () => {
    const { building: updated_building } = command.exec({
      city,
      building_to_finish,
      player_id
    })

    assert.ok(building_to_finish.upgrade_at)
    assert.ok(!updated_building.upgrade_at)
  })
})
