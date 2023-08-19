import { BuildingUpgradeCommand } from '#app/command/building/upgrade'
import { BuildingEntity } from '#core/building/entity'
import { BuildingError } from '#core/building/error'
import { CityEntity } from '#core/city/entity'
import { CityError } from '#core/city/error'
import assert from 'assert'

describe('BuildingUpgradeCommand', () => {
  const player_id = 'player_id'
  let command: BuildingUpgradeCommand
  let city: CityEntity
  let building: BuildingEntity

  beforeEach(() => {
    command = new BuildingUpgradeCommand()
    city = CityEntity.create({
      ...CityEntity.initCity({
        name: 'dummy',
        player_id
      }),
      plastic: 1000,
      mushroom: 1000
    })
    building = BuildingEntity.initMushroomFarm({ city_id: city.id })
  })

  it('should prevent a player to upgrade building in another player city', () => {
    assert.throws(() => command.exec({
      architecture_level: 0,
      building,
      city,
      is_building_in_progress: false,
      player_id: 'another_player_id'
    }), new RegExp(CityError.NOT_OWNER))
  })

  it('should prevent a player to upgrade if city does not have enough resources', () => {
    const city_without_ressources = CityEntity.create({
      ...city,
      plastic: 0,
      mushroom: 0
    })

    assert.throws(() => command.exec({
      architecture_level: 0,
      building,
      city: city_without_ressources,
      is_building_in_progress: false,
      player_id
    }), new RegExp(CityError.NOT_ENOUGH_RESOURCES))
  })

  it('should prevent a player to upgrade if another building is in progress', () => {
    assert.throws(() => command.exec({
      architecture_level: 0,
      building,
      city,
      is_building_in_progress: true,
      player_id
    }), new RegExp(BuildingError.ALREADY_IN_PROGRESS))
  })

  it('should purchase the upgrade', () => {
    const { city: updated_city } = command.exec({
      architecture_level: 0,
      building,
      city,
      is_building_in_progress: false,
      player_id
    })

    assert.ok(updated_city.plastic < city.plastic)
    assert.ok(updated_city.mushroom < city.mushroom)
  })

  it('should launch the building upgrade', () => {
    const { building: updated_building } = command.exec({
      architecture_level: 0,
      building,
      city,
      is_building_in_progress: false,
      player_id
    })

    assert.ok(!building.upgrade_at)
    assert.ok(updated_building.upgrade_at)
  })

  it('should take less time to upgrade with an increase architecture level', () => {
    const { building: building_without_architecture_level } = command.exec({
      architecture_level: 0,
      building,
      city,
      is_building_in_progress: false,
      player_id
    })

    const { building: building_with_architecture_level } = command.exec({
      architecture_level: 10,
      building,
      city,
      is_building_in_progress: false,
      player_id
    })

    assert.ok(building_with_architecture_level.upgrade_at)
    assert.ok(building_without_architecture_level.upgrade_at)
    assert.ok(building_with_architecture_level.upgrade_at < building_without_architecture_level.upgrade_at)
  })
})
