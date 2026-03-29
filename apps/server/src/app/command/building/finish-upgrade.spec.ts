import { finishBuildingUpgrade } from '#app/command/building/finish-upgrade'
import { Factory } from '#adapter/factory'
import { Repository } from '#app/port/repository/generic'
import { BuildingCode } from '#core/building/constant/code'
import { BuildingEntity } from '#core/building/entity'
import { CityEntity } from '#core/city/entity'
import { CityError } from '#core/city/error'
import { now } from '#shared/time'
import assert from 'assert'

describe('finishBuildingUpgrade', () => {
  const player_id = 'player_id'
  let city: CityEntity
  let building_to_finish: BuildingEntity
  let buildingUpdateOne: jest.Mock
  let repository: Pick<Repository, 'building' | 'city'>

  beforeEach(() => {
    city = CityEntity.initCity({
      name: 'dummy',
      player_id
    })
    building_to_finish = BuildingEntity.create({
      id: 'building_id',
      level: 0,
      code: BuildingCode.MUSHROOM_FARM,
      city_id: city.id,
      upgrade_at: now()
    })

    buildingUpdateOne = jest.fn().mockResolvedValue(undefined)

    repository = {
      building: {
        getUpgradeDone: jest.fn().mockResolvedValue(building_to_finish),
        updateOne: buildingUpdateOne
      } as unknown as Repository['building'],
      city: {
        get: jest.fn().mockResolvedValue(city)
      } as unknown as Repository['city']
    }

    jest.spyOn(Factory, 'getRepository').mockReturnValue(repository as unknown as Repository)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should prevent a player to upgrade building in another player city', async () => {
    await assert.rejects(
      () => finishBuildingUpgrade({
        city_id: city.id,
        player_id: 'another_player_id'
      }),
      new RegExp(CityError.NOT_OWNER)
    )
  })

  it('should not return any update if there is no building in progress', async () => {
    repository.building.getUpgradeDone = jest.fn().mockResolvedValue(null)

    const result = await finishBuildingUpgrade({
      city_id: city.id,
      player_id
    })

    assert.ok(result === null)
    assert.strictEqual(buildingUpdateOne.mock.calls.length, 0)
  })

  it('should finish the building upgrade', async () => {
    const result = await finishBuildingUpgrade({
      city_id: city.id,
      player_id
    })

    const updated_building = buildingUpdateOne.mock.calls[0][0]
    assert.ok(building_to_finish.upgrade_at)
    assert.ok(updated_building)
    assert.ok(!updated_building.upgrade_at)
    assert.ok(result)
    assert.strictEqual(result?.code, BuildingCode.MUSHROOM_FARM)
    assert.strictEqual(result?.upgraded_at, building_to_finish.upgrade_at)
  })
})
