import { cancelTroup } from '#app/command/troup/cancel'
import { Factory } from '#adapter/factory'
import { Repository } from '#app/port/repository/generic'
import { TroupCode } from '#core/troup/constant/code'
import { TroupEntity } from '#core/troup/entity'
import { TroupError } from '#core/troup/error'
import { CityEntity } from '#core/city/entity'
import { CityError } from '#core/city/error'
import { now } from '#shared/time'
import assert from 'assert'
import { troup_costs } from '#core/pricing/constant/troup'

describe('cancelTroup', () => {
  const player_id = 'player_id'
  const another_player_id = 'another_player_id'
  const code = TroupCode.EXPLORER
  const cell_id = 'cell_id'
  let city: CityEntity
  let troup: TroupEntity
  let troupUpdateOne: jest.Mock
  let cityUpdateOne: jest.Mock
  let repository: Pick<Repository, 'cell' | 'city' | 'troup'>

  beforeEach(() => {
    city = CityEntity.initCity({
      name: 'dummy',
      player_id,
    })

    const current_time = now()
    const last_progress = current_time - troup_costs[code].duration * 1000
    const remaining_count = 1000
    troup = TroupEntity.create({
      id: 'troup_id',
      code,
      count: 0,
      cell_id,
      player_id,
      movement_id: null,
      ongoing_recruitment: {
        finish_at: last_progress + 1000 * remaining_count * troup_costs[code].duration,
        remaining_count,
        last_progress,
      },
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
      troup: {
        getInProgress: jest.fn().mockResolvedValue(troup),
        updateOne: troupUpdateOne,
      } as unknown as Repository['troup'],
    }

    jest.spyOn(Factory, 'getRepository').mockReturnValue(repository as unknown as Repository)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should prevent player from cancelling other player troups', async () => {
    await assert.rejects(
      () => cancelTroup({
        city_id: city.id,
        player_id: another_player_id,
      }),
      new RegExp(CityError.NOT_OWNER)
    )
  })

  it('should assert that there is a troup in progress', async () => {
    repository.troup.getInProgress = jest.fn().mockResolvedValue(null)

    await assert.rejects(
      () => cancelTroup({
        city_id: city.id,
        player_id,
      }),
      new RegExp(TroupError.NOT_IN_PROGRESS)
    )
  })

  it('should refund the remaining troup price when troup is cancelled', async () => {
    await cancelTroup({
      city_id: city.id,
      player_id,
    })

    const updated_city = cityUpdateOne.mock.calls[0][0]
    assert.strictEqual(updated_city.plastic, city.plastic + 999 * troup_costs[code].plastic)
    assert.strictEqual(updated_city.mushroom, city.mushroom + 999 * troup_costs[code].mushroom)
  })

  it('should recruit troups since the last progress', async () => {
    await cancelTroup({
      city_id: city.id,
      player_id,
    })

    const updated_troup = troupUpdateOne.mock.calls[0][0]
    assert.strictEqual(updated_troup.count, 1)
  })

  it('should cancel troup', async () => {
    await cancelTroup({
      city_id: city.id,
      player_id,
    })

    const updated_troup = troupUpdateOne.mock.calls[0][0]
    assert.ok(troup.ongoing_recruitment)
    assert.ok(!updated_troup.ongoing_recruitment)
  })
})
