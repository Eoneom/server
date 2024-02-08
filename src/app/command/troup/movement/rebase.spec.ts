import {
  TroupRebaseCommand, TroupRebaseCommandExec
} from '#app/command/troup/movement/rebase'
import { ReportType } from '#core/communication/value/report-type'
import { TroupCode } from '#core/troup/constant/code'
import { MovementAction } from '#core/troup/constant/movement-action'
import { TroupEntity } from '#core/troup/entity'
import { TroupError } from '#core/troup/error'
import { MovementEntity } from '#core/troup/movement.entity'
import { id } from '#shared/identification'
import { now } from '#shared/time'
import assert from 'assert'

describe('TroupRebaseCommand', () => {
  const player_id = 'player_id'

  let initial_base_movement: MovementEntity
  let initial_movement_troups: TroupEntity[]
  let success_params: TroupRebaseCommandExec

  beforeEach(() => {
    initial_base_movement = MovementEntity.create({
      id: id(),
      action: MovementAction.BASE,
      player_id,
      arrive_at: now() + 10*1000,
      origin: {
        x: 1,
        y: 2,
        sector: 3
      },
      destination: {
        x: 4,
        y: 5,
        sector: 6
      },
    })
    initial_movement_troups = [
      TroupEntity.create({
        id: id(),
        code: TroupCode.EXPLORER,
        count: 1,
        player_id,
        cell_id: null,
        movement_id: initial_base_movement.id,
        ongoing_recruitment: null
      })
    ]
    success_params = {
      player_id,
      movement: initial_base_movement,
      troups: initial_movement_troups
    }
  })

  it('should prevent player from rebasing another player troups', () => {
    assert.throws(() => new TroupRebaseCommand().exec({
      ...success_params,
      movement: MovementEntity.create({
        ...initial_base_movement,
        player_id: 'another_player_id'
      })
    }), new RegExp(TroupError.NOT_OWNER))
  })

  it('should remove old movement', () => {
    const { movement_to_remove } = new TroupRebaseCommand().exec(success_params)

    assert.strictEqual(movement_to_remove.id, initial_base_movement.id)
  })

  it('should create a new movement with same troups and reversed trip', () => {
    const {
      movement_to_create,
      troups_to_update
    } = new TroupRebaseCommand().exec(success_params)

    assert.deepStrictEqual(movement_to_create.origin, initial_base_movement.destination)
    assert.deepStrictEqual(movement_to_create.destination, initial_base_movement.origin)
    assert.ok(movement_to_create.arrive_at > initial_base_movement.arrive_at)

    troups_to_update.forEach(troup_to_update => {
      const initial_troup = initial_movement_troups.find(troup => troup.code === troup_to_update.code)

      assert.ok(initial_troup)
      assert.strictEqual(troup_to_update.id, initial_troup.id)
      assert.strictEqual(troup_to_update.count, initial_troup.count)
    })
  })

  it('should create a report indicating that a rebase was needed', () => {
    const { report } = new TroupRebaseCommand().exec(success_params)

    assert.strictEqual(report.type, ReportType.REBASE)
    assert.strictEqual(report.player_id, player_id)
    assert.strictEqual(report.was_read, false)

    assert.strictEqual(report.recorded_at, initial_base_movement.arrive_at)
    assert.deepStrictEqual(report.origin, initial_base_movement.origin)
    assert.deepStrictEqual(report.destination, initial_base_movement.destination)

    initial_movement_troups.forEach(movement_troup => {
      const report_troup = report.troups.find(troup => troup.code === movement_troup.code)
      assert.ok(report_troup)
      assert.strictEqual(report_troup.code, movement_troup.code)
      assert.strictEqual(report_troup.count, movement_troup.count)
    })
  })
})
