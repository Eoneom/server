import { progressTroopRecruitment } from '#app/command/troop/progress-recruit'
import { Factory } from '#adapter/factory'
import { Repository } from '#app/port/repository/generic'
import { CityEntity } from '#core/city/entity'
import { CityError } from '#core/city/error'
import { TroopCode } from '#core/troop/constant/code'
import { TroopEntity } from '#core/troop/entity'
import { TroopError } from '#core/troop/error'
import { now } from '#shared/time'
import assert from 'assert'

describe('progressTroopRecruitment', () => {
  const player_id = 'player_id'
  const cell_id = 'cell_id'
  let city: CityEntity
  let troop: TroopEntity
  let troopUpdateOne: jest.Mock
  let repository: Pick<Repository, 'cell' | 'city' | 'troop'>

  beforeEach(() => {
    city = CityEntity.create({
      ...CityEntity.initCity({
        name: 'dummy',
        player_id,
      }),
      plastic: 100000,
      mushroom: 100000,
    })
    const troop_creation_time = now()
    troop = TroopEntity.create({
      ...TroopEntity.init({
        player_id,
        cell_id,
        code: TroopCode.EXPLORER,
      }),
      ongoing_recruitment: {
        remaining_count: 1000,
        last_progress: troop_creation_time,
        finish_at: troop_creation_time + 10000,
        started_at: troop_creation_time,
      },
    })

    troopUpdateOne = jest.fn().mockResolvedValue(undefined)

    repository = {
      cell: {
        getCityCell: jest.fn().mockResolvedValue({ id: cell_id }),
      } as unknown as Repository['cell'],
      city: {
        get: jest.fn().mockResolvedValue(city),
      } as unknown as Repository['city'],
      troop: {
        getInProgress: jest.fn().mockResolvedValue(troop),
        updateOne: troopUpdateOne,
      } as unknown as Repository['troop'],
    }

    jest.spyOn(Factory, 'getRepository').mockReturnValue(repository as unknown as Repository)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should prevent player to progress recruitment in another player city', async () => {
    await assert.rejects(
      () => progressTroopRecruitment({
        city_id: city.id,
        player_id: 'another_player_id',
      }),
      new RegExp(CityError.NOT_OWNER)
    )
  })

  it('should prevent player to progress when there is not current recruitment', async () => {
    repository.troop.getInProgress = jest.fn().mockResolvedValue(null)

    await assert.rejects(
      () => progressTroopRecruitment({
        city_id: city.id,
        player_id,
      }),
      new RegExp(TroopError.NOT_IN_PROGRESS)
    )
  })

  it('should make recruitment progress', async () => {
    await progressTroopRecruitment({
      city_id: city.id,
      player_id,
    })

    const updated_troop = troopUpdateOne.mock.calls[0][0]
    assert.ok(updated_troop.ongoing_recruitment)
    assert.ok(troop.ongoing_recruitment)
    assert.strictEqual(updated_troop.ongoing_recruitment.finish_at, troop.ongoing_recruitment.finish_at)
  })
})
