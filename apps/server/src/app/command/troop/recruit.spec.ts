import { recruitTroop } from '#app/command/troop/recruit'
import { AppService } from '#app/service'
import { Factory } from '#adapter/factory'
import { Repository } from '#app/port/repository/generic'
import { BuildingCode } from '#core/building/constant/code'
import { CityEntity } from '#core/city/entity'
import { CityError } from '#core/city/error'
import { RequirementError } from '#core/requirement/error'
import { TroopCode } from '#core/troop/constant/code'
import { TroopEntity } from '#core/troop/entity'
import { TroopError } from '#core/troop/error'
import assert from 'assert'
import { testResourceStock, testCityCell } from '../../test-support/resource-stock'

describe('recruitTroop', () => {
  const player_id = 'player_id'
  const requested_troop_count = 10
  const cell_id = 'cell_id'
  let city: CityEntity
  let city_cell: ReturnType<typeof testCityCell>
  let stock: ReturnType<typeof testResourceStock>
  let troop: TroopEntity
  let troopUpdateOne: jest.Mock
  let stockUpdateOne: jest.Mock
  let repository: Pick<Repository, 'cell' | 'city' | 'building' | 'technology' | 'troop' | 'resource_stock'>

  beforeEach(() => {
    city = CityEntity.initCity({
      name: 'dummy',
      player_id,
    })
    city_cell = testCityCell({ city_id: city.id, cell_id })
    stock = testResourceStock({
      cell_id,
      plastic: 100000,
      mushroom: 100000
    })
    troop = TroopEntity.init({
      player_id,
      cell_id,
      code: TroopCode.EXPLORER,
    })

    troopUpdateOne = jest.fn().mockResolvedValue(undefined)
    stockUpdateOne = jest.fn().mockResolvedValue(undefined)

    repository = {
      cell: {
        getCityCell: jest.fn().mockResolvedValue(city_cell),
      } as unknown as Repository['cell'],
      city: {
        get: jest.fn().mockResolvedValue(city),
      } as unknown as Repository['city'],
      building: {
        getLevel: jest.fn().mockResolvedValue(0),
      } as unknown as Repository['building'],
      technology: {
        getLevel: jest.fn().mockResolvedValue(0),
      } as unknown as Repository['technology'],
      troop: {
        getInCell: jest.fn().mockResolvedValue(troop),
        isInProgress: jest.fn().mockResolvedValue(false),
        updateOne: troopUpdateOne,
      } as unknown as Repository['troop'],
      resource_stock: {
        getByCellId: jest.fn().mockResolvedValue(stock),
        updateOne: stockUpdateOne,
      } as unknown as Repository['resource_stock'],
    }

    jest.spyOn(Factory, 'getRepository').mockReturnValue(repository as unknown as Repository)
    jest.spyOn(AppService, 'getTroopRequirementLevels').mockResolvedValue({
      building: { [BuildingCode.CLONING_FACTORY]: 1 },
      technology: {},
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should prevent player to recruit in another player city', async () => {
    await assert.rejects(
      () => recruitTroop({
        city_id: city.id,
        player_id: 'another_player_id',
        troop_code: TroopCode.EXPLORER,
        count: requested_troop_count,
      }),
      new RegExp(CityError.NOT_OWNER)
    )
  })

  it('should prevent player to recruit when city does not have enough resources', async () => {
    const broke = testResourceStock({ cell_id, plastic: 0, mushroom: 0 })
    repository.resource_stock.getByCellId = jest.fn().mockResolvedValue(broke)

    await assert.rejects(
      () => recruitTroop({
        city_id: city.id,
        player_id,
        troop_code: TroopCode.EXPLORER,
        count: requested_troop_count,
      }),
      new RegExp(CityError.NOT_ENOUGH_RESOURCES)
    )
  })

  it('should prevent player to recruit when recruitment is already in progress', async () => {
    repository.troop.isInProgress = jest.fn().mockResolvedValue(true)

    await assert.rejects(
      () => recruitTroop({
        city_id: city.id,
        player_id,
        troop_code: TroopCode.EXPLORER,
        count: requested_troop_count,
      }),
      new RegExp(TroopError.ALREADY_IN_PROGRESS)
    )
  })

  it('should prevent player to recruit if building requirements are not met', async () => {
    jest.spyOn(AppService, 'getTroopRequirementLevels').mockResolvedValue({
      building: {},
      technology: {},
    })

    await assert.rejects(
      () => recruitTroop({
        city_id: city.id,
        player_id,
        troop_code: TroopCode.EXPLORER,
        count: requested_troop_count,
      }),
      new RegExp(RequirementError.BUILDING_NOT_FULFILLED)
    )
  })

  it('should purchase the troops in the city', async () => {
    await recruitTroop({
      city_id: city.id,
      player_id,
      troop_code: TroopCode.EXPLORER,
      count: requested_troop_count,
    })

    const updated_stock = stockUpdateOne.mock.calls[0][0]
    assert.ok(updated_stock.plastic < stock.plastic)
    assert.ok(updated_stock.mushroom < stock.mushroom)
  })

  it('should launch troops recruitment', async () => {
    await recruitTroop({
      city_id: city.id,
      player_id,
      troop_code: TroopCode.EXPLORER,
      count: requested_troop_count,
    })

    const updated_troop = troopUpdateOne.mock.calls[0][0]
    assert.ok(updated_troop.ongoing_recruitment)
    assert.ok(updated_troop.ongoing_recruitment.finish_at)
    assert.ok(updated_troop.ongoing_recruitment.last_progress)
    assert.strictEqual(updated_troop.ongoing_recruitment.remaining_count, requested_troop_count)
  })
})
