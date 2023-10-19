import {
  BuildingUpgradeCommand,
  BuildingUpgradeExec
} from '#app/command/building/upgrade'
import { BuildingCode } from '#core/building/constant/code'
import { BuildingEntity } from '#core/building/entity'
import { BuildingError } from '#core/building/error'
import { CityEntity } from '#core/city/entity'
import { CityError } from '#core/city/error'
import { RequirementError } from '#core/requirement/error'
import { TechnologyCode } from '#core/technology/constant/code'
import assert from 'assert'

describe('BuildingUpgradeCommand', () => {
  const player_id = 'player_id'
  let command: BuildingUpgradeCommand
  let city: CityEntity
  let building: BuildingEntity
  let success_params: BuildingUpgradeExec

  beforeEach(() => {
    command = new BuildingUpgradeCommand()
    city = CityEntity.create({
      ...CityEntity.initCity({
        name: 'dummy',
        player_id
      }),
      plastic: 30000,
      mushroom: 30000
    })
    building = BuildingEntity.create({
      id: 'building_id',
      code: BuildingCode.CLONING_FACTORY,
      level: 0,
      city_id: city.id
    })

    success_params = {
      architecture_level: 0,
      total_building_levels: 1,
      maximum_building_levels: 2,
      building,
      city,
      is_building_in_progress: false,
      levels: {
        building: {},
        technology: { [TechnologyCode.ARCHITECTURE]: 2 }
      },
      player_id
    }
  })

  it('should prevent a player to upgrade building in another player city', () => {
    assert.throws(() => command.exec({
      ...success_params,
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
      ...success_params,
      city: city_without_ressources,
    }), new RegExp(CityError.NOT_ENOUGH_RESOURCES))
  })

  it('should prevent a player to upgrade if another building is in progress', () => {
    assert.throws(() => command.exec({
      ...success_params,
      is_building_in_progress: true,
    }), new RegExp(BuildingError.ALREADY_IN_PROGRESS))
  })

  it('should prevent a player to upgrade if there is no more space in the city', () => {
    assert.throws(() => command.exec({
      ...success_params,
      total_building_levels: 10,
      maximum_building_levels: 10
    }), new RegExp(CityError.NOT_ENOUGH_SPACE))
  })

  it('should prevent player to research if technology requirements are not met', () => {
    assert.throws(() => command.exec({
      ...success_params,
      levels: {
        ...success_params.levels,
        building: {},
        technology: {}
      }
    }), new RegExp(RequirementError.TECHNOLOGY_NOT_FULFILLED))
  })

  it('should purchase the upgrade', () => {
    const { city: updated_city } = command.exec(success_params)

    assert.ok(updated_city.plastic < city.plastic)
    assert.ok(updated_city.mushroom < city.mushroom)
  })

  it('should launch the building upgrade', () => {
    const { building: updated_building } = command.exec(success_params)

    assert.ok(!building.upgrade_at)
    assert.ok(updated_building.upgrade_at)
  })

  it('should take less time to upgrade with an increase architecture level', () => {
    const { building: building_without_architecture_level } = command.exec({
      ...success_params,
      architecture_level: 0,
    })

    const { building: building_with_architecture_level } = command.exec({
      ...success_params,
      architecture_level: 10,
    })

    assert.ok(building_with_architecture_level.upgrade_at)
    assert.ok(building_without_architecture_level.upgrade_at)
    assert.ok(building_with_architecture_level.upgrade_at < building_without_architecture_level.upgrade_at)
  })
})
