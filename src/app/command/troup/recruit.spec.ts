import { recruitTroup } from '#app/command/troup/recruit'
import { AppService } from '#app/service'
import { Factory } from '#adapter/factory'
import { Repository } from '#app/port/repository/generic'
import { BuildingCode } from '#core/building/constant/code'
import { CityEntity } from '#core/city/entity'
import { CityError } from '#core/city/error'
import { RequirementError } from '#core/requirement/error'
import { TroupCode } from '#core/troup/constant/code'
import { TroupEntity } from '#core/troup/entity'
import { TroupError } from '#core/troup/error'
import assert from 'assert'

describe('recruitTroup', () => {
  const player_id = 'player_id'
  const requested_troup_count = 10
  const cell_id = 'cell_id'
  let city: CityEntity
  let troup: TroupEntity
  let troupUpdateOne: jest.Mock
  let cityUpdateOne: jest.Mock
  let repository: Pick<Repository, 'cell' | 'city' | 'building' | 'technology' | 'troup'>

  beforeEach(() => {
    city = CityEntity.create({
      ...CityEntity.initCity({
        name: 'dummy',
        player_id,
      }),
      plastic: 100000,
      mushroom: 100000,
    })
    troup = TroupEntity.init({
      player_id,
      cell_id,
      code: TroupCode.EXPLORER,
    })

    troupUpdateOne = jest.fn().mockResolvedValue(undefined)
    cityUpdateOne = jest.fn().mockResolvedValue(undefined)

    repository = {
      cell: {
        getCityCell: jest.fn().mockResolvedValue({ id: cell_id }),
      } as unknown as Repository['cell'],
      city: {
        get: jest.fn().mockResolvedValue(city),
        updateOne: cityUpdateOne,
      } as unknown as Repository['city'],
      building: {
        getLevel: jest.fn().mockResolvedValue(0),
      } as unknown as Repository['building'],
      technology: {
        getLevel: jest.fn().mockResolvedValue(0),
      } as unknown as Repository['technology'],
      troup: {
        getInCell: jest.fn().mockResolvedValue(troup),
        isInProgress: jest.fn().mockResolvedValue(false),
        updateOne: troupUpdateOne,
      } as unknown as Repository['troup'],
    }

    jest.spyOn(Factory, 'getRepository').mockReturnValue(repository as unknown as Repository)
    jest.spyOn(AppService, 'getTroupRequirementLevels').mockResolvedValue({
      building: { [BuildingCode.CLONING_FACTORY]: 1 },
      technology: {},
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should prevent player to recruit in another player city', async () => {
    await assert.rejects(
      () => recruitTroup({
        city_id: city.id,
        player_id: 'another_player_id',
        troup_code: TroupCode.EXPLORER,
        count: requested_troup_count,
      }),
      new RegExp(CityError.NOT_OWNER)
    )
  })

  it('should prevent player to recruit when city does not have enough resources', async () => {
    repository.city.get = jest.fn().mockResolvedValue(CityEntity.create({
      ...city,
      plastic: 0,
      mushroom: 0,
    }))

    await assert.rejects(
      () => recruitTroup({
        city_id: city.id,
        player_id,
        troup_code: TroupCode.EXPLORER,
        count: requested_troup_count,
      }),
      new RegExp(CityError.NOT_ENOUGH_RESOURCES)
    )
  })

  it('should prevent player to recruit when recruitment is already in progress', async () => {
    repository.troup.isInProgress = jest.fn().mockResolvedValue(true)

    await assert.rejects(
      () => recruitTroup({
        city_id: city.id,
        player_id,
        troup_code: TroupCode.EXPLORER,
        count: requested_troup_count,
      }),
      new RegExp(TroupError.ALREADY_IN_PROGRESS)
    )
  })

  it('should prevent player to recruit if building requirements are not met', async () => {
    jest.spyOn(AppService, 'getTroupRequirementLevels').mockResolvedValue({
      building: {},
      technology: {},
    })

    await assert.rejects(
      () => recruitTroup({
        city_id: city.id,
        player_id,
        troup_code: TroupCode.EXPLORER,
        count: requested_troup_count,
      }),
      new RegExp(RequirementError.BUILDING_NOT_FULFILLED)
    )
  })

  it('should purchase the troups in the city', async () => {
    await recruitTroup({
      city_id: city.id,
      player_id,
      troup_code: TroupCode.EXPLORER,
      count: requested_troup_count,
    })

    const updated_city = cityUpdateOne.mock.calls[0][0]
    assert.ok(updated_city.plastic < city.plastic)
    assert.ok(updated_city.mushroom < city.mushroom)
  })

  it('should launch troups recruitment', async () => {
    await recruitTroup({
      city_id: city.id,
      player_id,
      troup_code: TroupCode.EXPLORER,
      count: requested_troup_count,
    })

    const updated_troup = troupUpdateOne.mock.calls[0][0]
    assert.ok(updated_troup.ongoing_recruitment)
    assert.ok(updated_troup.ongoing_recruitment.finish_at)
    assert.ok(updated_troup.ongoing_recruitment.last_progress)
    assert.strictEqual(updated_troup.ongoing_recruitment.remaining_count, requested_troup_count)
  })
})
