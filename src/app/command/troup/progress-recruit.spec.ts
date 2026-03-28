import { progressTroupRecruitment } from '#app/command/troup/progress-recruit'
import { Factory } from '#adapter/factory'
import { Repository } from '#app/port/repository/generic'
import { CityEntity } from '#core/city/entity'
import { CityError } from '#core/city/error'
import { TroupCode } from '#core/troup/constant/code'
import { TroupEntity } from '#core/troup/entity'
import { TroupError } from '#core/troup/error'
import { now } from '#shared/time'
import assert from 'assert'

describe('progressTroupRecruitment', () => {
  const player_id = 'player_id'
  const cell_id = 'cell_id'
  let city: CityEntity
  let troup: TroupEntity
  let troupUpdateOne: jest.Mock
  let repository: Pick<Repository, 'cell' | 'city' | 'troup'>

  beforeEach(() => {
    city = CityEntity.create({
      ...CityEntity.initCity({
        name: 'dummy',
        player_id,
      }),
      plastic: 100000,
      mushroom: 100000,
    })
    const troup_creation_time = now()
    troup = TroupEntity.create({
      ...TroupEntity.init({
        player_id,
        cell_id,
        code: TroupCode.EXPLORER,
      }),
      ongoing_recruitment: {
        remaining_count: 1000,
        last_progress: troup_creation_time,
        finish_at: troup_creation_time + 10000,
      },
    })

    troupUpdateOne = jest.fn().mockResolvedValue(undefined)

    repository = {
      cell: {
        getCityCell: jest.fn().mockResolvedValue({ id: cell_id }),
      } as unknown as Repository['cell'],
      city: {
        get: jest.fn().mockResolvedValue(city),
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

  it('should prevent player to progress recruitment in another player city', async () => {
    await assert.rejects(
      () => progressTroupRecruitment({
        city_id: city.id,
        player_id: 'another_player_id',
      }),
      new RegExp(CityError.NOT_OWNER)
    )
  })

  it('should prevent player to progress when there is not current recruitment', async () => {
    repository.troup.getInProgress = jest.fn().mockResolvedValue(null)

    await assert.rejects(
      () => progressTroupRecruitment({
        city_id: city.id,
        player_id,
      }),
      new RegExp(TroupError.NOT_IN_PROGRESS)
    )
  })

  it('should make recruitment progress', async () => {
    await progressTroupRecruitment({
      city_id: city.id,
      player_id,
    })

    const updated_troup = troupUpdateOne.mock.calls[0][0]
    assert.ok(updated_troup.ongoing_recruitment)
    assert.ok(troup.ongoing_recruitment)
    assert.strictEqual(updated_troup.ongoing_recruitment.finish_at, troup.ongoing_recruitment.finish_at)
  })
})
