import { upgradeBuilding } from '#app/command/building/upgrade'
import { AppService } from '#app/service'
import { Factory } from '#adapter/factory'
import { Repository } from '#app/port/repository/generic'
import { BuildingCode } from '#core/building/constant/code'
import { BuildingEntity } from '#core/building/entity'
import { BuildingError } from '#core/building/error'
import { CityEntity } from '#core/city/entity'
import { CityError } from '#core/city/error'
import { RequirementError } from '#core/requirement/error'
import { TechnologyCode } from '#core/technology/constant/code'
import { TechnologyEntity } from '#core/technology/entity'
import assert from 'assert'

describe('upgradeBuilding', () => {
  const player_id = 'player_id'
  let city: CityEntity
  let building: BuildingEntity
  let architecture: TechnologyEntity
  let cityUpdateOne: jest.Mock
  let buildingUpdateOne: jest.Mock
  let repository: Pick<Repository, 'building' | 'city' | 'technology' | 'cell'>

  beforeEach(() => {
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
    architecture = TechnologyEntity.create({
      id: 'tech_id',
      code: TechnologyCode.ARCHITECTURE,
      player_id,
      level: 0
    })

    buildingUpdateOne = jest.fn().mockResolvedValue(undefined)
    cityUpdateOne = jest.fn().mockResolvedValue(undefined)

    repository = {
      building: {
        get: jest.fn().mockResolvedValue(building),
        isInProgress: jest.fn().mockResolvedValue(false),
        getTotalLevels: jest.fn().mockResolvedValue(1),
        list: jest.fn().mockResolvedValue([]),
        updateOne: buildingUpdateOne
      } as unknown as Repository['building'],
      city: {
        get: jest.fn().mockResolvedValue(city),
        updateOne: cityUpdateOne
      } as unknown as Repository['city'],
      technology: {
        get: jest.fn().mockResolvedValue(architecture),
        list: jest.fn().mockResolvedValue([
          TechnologyEntity.create({
            id: 'arch_tech',
            code: TechnologyCode.ARCHITECTURE,
            player_id,
            level: 2
          })
        ])
      } as unknown as Repository['technology'],
      cell: {
        getCityCellsCount: jest.fn().mockResolvedValue(10)
      } as unknown as Repository['cell']
    }

    jest.spyOn(Factory, 'getRepository').mockReturnValue(repository as unknown as Repository)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should prevent a player to upgrade building in another player city', async () => {
    await assert.rejects(
      () => upgradeBuilding({
        player_id: 'another_player_id',
        city_id: city.id,
        building_code: BuildingCode.CLONING_FACTORY
      }),
      new RegExp(CityError.NOT_OWNER)
    )
  })

  it('should prevent a player to upgrade if city does not have enough resources', async () => {
    const city_without_ressources = CityEntity.create({
      ...city,
      plastic: 0,
      mushroom: 0
    })
    repository.city.get = jest.fn().mockResolvedValue(city_without_ressources)

    await assert.rejects(
      () => upgradeBuilding({
        player_id,
        city_id: city.id,
        building_code: BuildingCode.CLONING_FACTORY
      }),
      new RegExp(CityError.NOT_ENOUGH_RESOURCES)
    )
  })

  it('should prevent a player to upgrade if another building is in progress', async () => {
    repository.building.isInProgress = jest.fn().mockResolvedValue(true)

    await assert.rejects(
      () => upgradeBuilding({
        player_id,
        city_id: city.id,
        building_code: BuildingCode.CLONING_FACTORY
      }),
      new RegExp(BuildingError.ALREADY_IN_PROGRESS)
    )
  })

  it('should prevent a player to upgrade if there is no more space in the city', async () => {
    repository.building.getTotalLevels = jest.fn().mockResolvedValue(10)
    jest.spyOn(AppService, 'getCityMaximumBuildingLevels').mockResolvedValue(10)

    await assert.rejects(
      () => upgradeBuilding({
        player_id,
        city_id: city.id,
        building_code: BuildingCode.CLONING_FACTORY
      }),
      new RegExp(CityError.NOT_ENOUGH_SPACE)
    )
  })

  it('should prevent player to research if technology requirements are not met', async () => {
    repository.technology.list = jest.fn().mockResolvedValue([])

    await assert.rejects(
      () => upgradeBuilding({
        player_id,
        city_id: city.id,
        building_code: BuildingCode.CLONING_FACTORY
      }),
      new RegExp(RequirementError.TECHNOLOGY_NOT_FULFILLED)
    )
  })

  it('should purchase the upgrade', async () => {
    await upgradeBuilding({
      player_id,
      city_id: city.id,
      building_code: BuildingCode.CLONING_FACTORY
    })

    const updated_city = cityUpdateOne.mock.calls[0][0]
    assert.ok(updated_city.plastic < city.plastic)
    assert.ok(updated_city.mushroom < city.mushroom)
  })

  it('should launch the building upgrade', async () => {
    await upgradeBuilding({
      player_id,
      city_id: city.id,
      building_code: BuildingCode.CLONING_FACTORY
    })

    const updated_building = buildingUpdateOne.mock.calls[0][0]
    assert.ok(!building.upgrade_at)
    assert.ok(updated_building.upgrade_at)
  })

  it('should take less time to upgrade with an increase architecture level', async () => {
    repository.technology.get = jest
      .fn()
      .mockResolvedValueOnce(
        TechnologyEntity.create({
          id: architecture.id,
          code: TechnologyCode.ARCHITECTURE,
          player_id,
          level: 0
        })
      )
      .mockResolvedValueOnce(
        TechnologyEntity.create({
          id: architecture.id,
          code: TechnologyCode.ARCHITECTURE,
          player_id,
          level: 10
        })
      )

    await upgradeBuilding({
      player_id,
      city_id: city.id,
      building_code: BuildingCode.CLONING_FACTORY
    })
    const building_without_architecture_level = buildingUpdateOne.mock.calls[0][0]

    await upgradeBuilding({
      player_id,
      city_id: city.id,
      building_code: BuildingCode.CLONING_FACTORY
    })
    const building_with_architecture_level = buildingUpdateOne.mock.calls[1][0]

    assert.ok(building_with_architecture_level.upgrade_at)
    assert.ok(building_without_architecture_level.upgrade_at)
    assert.ok(building_with_architecture_level.upgrade_at < building_without_architecture_level.upgrade_at)
  })
})
