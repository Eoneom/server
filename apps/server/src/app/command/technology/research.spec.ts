import { researchTechnology } from './research'
import { Factory } from '#adapter/factory'
import { AppService } from '#app/service'
import { Repository } from '#app/port/repository/generic'
import { BuildingCode } from '#core/building/constant/code'
import { BuildingEntity } from '#core/building/entity'
import { CityEntity } from '#core/city/entity'
import { CityError } from '#core/city/error'
import { RequirementError } from '#core/requirement/error'
import { TechnologyCode } from '#core/technology/constant/code'
import { TechnologyEntity } from '#core/technology/entity'
import { TechnologyError } from '#core/technology/error'
import assert from 'assert'

describe('researchTechnology', () => {
  const player_id = 'player_id'
  let city: CityEntity
  let technology: TechnologyEntity
  let research_lab: BuildingEntity
  let cityUpdateOne: jest.Mock
  let technologyUpdateOne: jest.Mock
  let repository: Pick<Repository, 'city' | 'technology' | 'building'>

  beforeEach(() => {
    city = CityEntity.create({
      ...CityEntity.initCity({
        name: 'dummy',
        player_id
      }),
      plastic: 100000,
      mushroom: 100000
    })
    technology = TechnologyEntity.init({
      player_id,
      code: TechnologyCode.ARCHITECTURE
    })
    research_lab = BuildingEntity.create({
      id: 'research_lab_id',
      city_id: city.id,
      code: BuildingCode.RESEARCH_LAB,
      level: 0
    })

    cityUpdateOne = jest.fn().mockResolvedValue(undefined)
    technologyUpdateOne = jest.fn().mockResolvedValue(undefined)

    repository = {
      city: {
        get: jest.fn().mockResolvedValue(city),
        updateOne: cityUpdateOne
      } as unknown as Repository['city'],
      technology: {
        get: jest.fn().mockResolvedValue(technology),
        isInProgress: jest.fn().mockResolvedValue(false),
        updateOne: technologyUpdateOne
      } as unknown as Repository['technology'],
      building: {
        get: jest.fn().mockResolvedValue(research_lab)
      } as unknown as Repository['building']
    }

    jest.spyOn(Factory, 'getRepository').mockReturnValue(repository as unknown as Repository)
    jest.spyOn(AppService, 'getTechnologyRequirementLevels').mockResolvedValue({
      building: { [BuildingCode.RESEARCH_LAB]: 1 },
      technology: {}
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should prevent a player to research technology in another player city', async () => {
    await assert.rejects(
      () => researchTechnology({
        city_id: city.id,
        player_id: 'another_player_id',
        technology_code: TechnologyCode.ARCHITECTURE
      }),
      new RegExp(CityError.NOT_OWNER)
    )

    assert.strictEqual(cityUpdateOne.mock.calls.length, 0)
    assert.strictEqual(technologyUpdateOne.mock.calls.length, 0)
  })

  it('should prevent a player to research if city does not have enough resources', async () => {
    const city_without_resources = CityEntity.create({
      ...city,
      plastic: 0,
      mushroom: 0
    })
    repository.city.get = jest.fn().mockResolvedValue(city_without_resources)

    await assert.rejects(
      () => researchTechnology({
        city_id: city.id,
        player_id,
        technology_code: TechnologyCode.ARCHITECTURE
      }),
      new RegExp(CityError.NOT_ENOUGH_RESOURCES)
    )

    assert.strictEqual(cityUpdateOne.mock.calls.length, 0)
    assert.strictEqual(technologyUpdateOne.mock.calls.length, 0)
  })

  it('should prevent a player to research if another technology is in progress', async () => {
    repository.technology.isInProgress = jest.fn().mockResolvedValue(true)

    await assert.rejects(
      () => researchTechnology({
        city_id: city.id,
        player_id,
        technology_code: TechnologyCode.ARCHITECTURE
      }),
      new RegExp(TechnologyError.ALREADY_IN_PROGRESS)
    )

    assert.strictEqual(cityUpdateOne.mock.calls.length, 0)
    assert.strictEqual(technologyUpdateOne.mock.calls.length, 0)
  })

  it('should prevent player to research if building requirements are not met', async () => {
    jest.spyOn(AppService, 'getTechnologyRequirementLevels').mockResolvedValue({
      building: {},
      technology: {}
    })

    await assert.rejects(
      () => researchTechnology({
        city_id: city.id,
        player_id,
        technology_code: TechnologyCode.ARCHITECTURE
      }),
      new RegExp(RequirementError.BUILDING_NOT_FULFILLED)
    )

    assert.strictEqual(cityUpdateOne.mock.calls.length, 0)
    assert.strictEqual(technologyUpdateOne.mock.calls.length, 0)
  })

  it('should purchase the research', async () => {
    await researchTechnology({
      city_id: city.id,
      player_id,
      technology_code: TechnologyCode.ARCHITECTURE
    })

    assert.strictEqual(cityUpdateOne.mock.calls.length, 1)
    const updated_city = cityUpdateOne.mock.calls[0][0]
    assert.ok(updated_city.plastic < city.plastic)
    assert.ok(updated_city.mushroom < city.mushroom)
  })

  it('should launch the technology research', async () => {
    await researchTechnology({
      city_id: city.id,
      player_id,
      technology_code: TechnologyCode.ARCHITECTURE
    })

    assert.strictEqual(technologyUpdateOne.mock.calls.length, 1)
    const updated_technology = technologyUpdateOne.mock.calls[0][0]
    assert.ok(!technology.research_at)
    assert.ok(updated_technology.research_at)
  })
})
