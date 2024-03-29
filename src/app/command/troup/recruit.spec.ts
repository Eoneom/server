import {
  TroupRecruitCommand,
  TroupRecruitExec
} from '#app/command/troup/recruit'
import { BuildingCode } from '#core/building/constant/code'
import { CityEntity } from '#core/city/entity'
import { CityError } from '#core/city/error'
import { RequirementError } from '#core/requirement/error'
import { TroupCode } from '#core/troup/constant/code'
import { TroupEntity } from '#core/troup/entity'
import { TroupError } from '#core/troup/error'
import assert from 'assert'

describe('TroupRecruitCommand', () => {
  const player_id = 'player_id'
  const requested_troup_count = 10
  const cell_id = 'cell_id'
  let city: CityEntity
  let troup: TroupEntity
  let command: TroupRecruitCommand
  let success_params: TroupRecruitExec

  beforeEach(() => {
    command = new TroupRecruitCommand()
    city = CityEntity.create({
      ...CityEntity.initCity({
        name: 'dummy',
        player_id
      }),
      plastic: 100000,
      mushroom: 100000
    })
    troup = TroupEntity.init({
      player_id,
      cell_id,
      code: TroupCode.EXPLORER
    })

    success_params = {
      player_id,
      city,
      count: requested_troup_count,
      troup,
      is_recruitment_in_progress: false,
      cloning_factory_level: 0,
      replication_catalyst_level: 0,
      levels: {
        building: { [BuildingCode.CLONING_FACTORY]: 1 },
        technology: {}
      },
    }
  })

  it('should prevent player to recruit in another player city', () => (
    assert.throws(() => command.exec({
      ...success_params,
      player_id: 'another_player_id'
    }), new RegExp(CityError.NOT_OWNER))
  ))

  it('should prevent player to recruit when city does not have enough resources', () => (
    assert.throws(() => command.exec({
      ...success_params,
      city: CityEntity.create({
        ...city,
        plastic: 0,
        mushroom: 0
      })
    }), new RegExp(CityError.NOT_ENOUGH_RESOURCES))
  ))

  it('should prevent player to recruit when recruitment is already in progress', () => (
    assert.throws(() => command.exec({
      ...success_params,
      is_recruitment_in_progress: true
    }), new RegExp(TroupError.ALREADY_IN_PROGRESS))
  ))

  it('should prevent player to recruit if building requirements are not met', () => {
    assert.throws(() => command.exec({
      ...success_params,
      levels: {
        ...success_params.levels,
        building: {}
      }
    }), new RegExp(RequirementError.BUILDING_NOT_FULFILLED))
  })

  it('should purchase the troups in the city', () => {
    const { city: updated_city } = command.exec(success_params)

    assert.ok(updated_city.plastic < city.plastic)
    assert.ok(updated_city.mushroom < city.mushroom)
  })

  it('should launch troups recruitment', () => {
    const { troup: updated_troup } = command.exec(success_params)

    assert.ok(updated_troup.ongoing_recruitment)
    assert.ok(updated_troup.ongoing_recruitment.finish_at)
    assert.ok(updated_troup.ongoing_recruitment.last_progress)
    assert.strictEqual(updated_troup.ongoing_recruitment.remaining_count, requested_troup_count)
  })
})
