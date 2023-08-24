import {
  TroupProgressRecruitCommand,
  TroupProgressRecruitExec
} from '#app/command/troup/progress-recruit'
import { CityEntity } from '#core/city/entity'
import { CityError } from '#core/city/error'
import { TroupEntity } from '#core/troup/entity'
import { TroupError } from '#core/troup/error'
import { now } from '#shared/time'
import assert from 'assert'

describe('TroupRecruitCommand', () => {
  const player_id = 'player_id'
  let city: CityEntity
  let troup: TroupEntity
  let command: TroupProgressRecruitCommand
  let success_params: TroupProgressRecruitExec
  let troup_creation_time

  beforeEach(() => {
    command = new TroupProgressRecruitCommand()
    city = CityEntity.create({
      ...CityEntity.initCity({
        name: 'dummy',
        player_id
      }),
      plastic: 100000,
      mushroom: 100000
    })
    troup_creation_time = now()
    troup = TroupEntity.create({
      ...TroupEntity.initScout({
        player_id,
        city_id: city.id
      }),
      ongoing_recruitment: {
        remaining_count: 1000,
        last_progress: troup_creation_time,
        finish_at: troup_creation_time + 10000
      }
    })

    success_params = {
      player_id,
      city,
      troup,
    }
  })

  it('should prevent player to progress recruitment in another player city', () => (
    assert.throws(() => command.exec({
      ...success_params,
      player_id: 'another_player_id'
    }), new RegExp(CityError.NOT_OWNER))
  ))

  it('should prevent player to progress when there is not current recruitment', () => {
    assert.throws(() => command.exec({
      ...success_params,
      troup: null
    }), new RegExp(TroupError.NOT_IN_PROGRESS))
  })

  it('should make recruitment progress', () => {
    const { troup: updated_troup } = command.exec(success_params)

    assert.ok(updated_troup.ongoing_recruitment)
    assert.ok(troup.ongoing_recruitment)
    assert.strictEqual(updated_troup.ongoing_recruitment.finish_at, troup.ongoing_recruitment.finish_at)
  })
})
