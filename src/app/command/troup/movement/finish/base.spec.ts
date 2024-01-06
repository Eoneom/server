import assert from 'assert'
import { TroupCode } from '#core/troup/constant/code'
import { MovementAction } from '#core/troup/constant/movement-action'
import { TroupError } from '#core/troup/error'
import { MovementEntity } from '#core/troup/movement.entity'
import { now } from '#shared/time'
import { TroupEntity } from '#core/troup/entity'
import {
  TroupFinishBaseCommand,
  TroupFinishBaseCommandExec
} from '#app/command/troup/movement/finish/base'
import { Coordinates } from '#core/world/value/coordinates'
import { OutpostType } from '#core/outpost/constant/type'
import { OutpostError } from '#core/outpost/error'

describe('TroupFinishBaseCommand', () => {
  const player_id = 'player_id'
  const movement_id = 'movement_id'
  const movement_troup_id = 'movement_troup_id'
  const city_troup_id = 'city_troup_id'
  const origin: Coordinates = {
    sector: 1,
    x: 2,
    y: 3
  }
  const destination_cell_id = 'destination_cell_id'
  const destination: Coordinates = {
    sector: 4,
    x: 5,
    y: 6
  }
  let movement: MovementEntity
  let movement_troup_explorer: TroupEntity
  let movement_troup_settler: TroupEntity
  let destination_troup_explorer: TroupEntity
  let command: TroupFinishBaseCommand
  let success_params: TroupFinishBaseCommandExec

  beforeEach(() => {
    command = new TroupFinishBaseCommand()

    movement = MovementEntity.create({
      id: movement_id,
      player_id,
      action: MovementAction.BASE,
      origin,
      destination,
      arrive_at: now() - 5000
    })

    movement_troup_settler = TroupEntity.create({
      id: movement_troup_id,
      code: TroupCode.SETTLER,
      player_id,
      cell_id: null,
      count: 1,
      ongoing_recruitment: null,
      movement_id: movement.id
    })

    movement_troup_explorer = TroupEntity.create({
      id: movement_troup_id,
      code: TroupCode.EXPLORER,
      player_id,
      cell_id: null,
      count: 2,
      ongoing_recruitment: null,
      movement_id: movement.id
    })

    destination_troup_explorer = TroupEntity.create({
      id: city_troup_id,
      code: TroupCode.EXPLORER,
      player_id,
      cell_id: destination_cell_id,
      count: 1,
      ongoing_recruitment: null,
      movement_id: null
    })

    success_params = {
      movement,
      player_id,
      movement_troups: [
        movement_troup_explorer,
        movement_troup_settler
      ],
      destination_troups: [ destination_troup_explorer ],
      destination_cell_id,
      city_exists: false,
      outpost_exists: false,
      existing_outposts_count: 0
    }
  })

  it('should prevent a player for finishing a movement of another player', () => {
    assert.throws(() => command.exec({
      ...success_params,
      movement: MovementEntity.create({
        ...movement,
        player_id: 'another_player_id'
      })
    }), new RegExp(TroupError.NOT_OWNER))
  })

  it('should prevent a player from finishing a movement when arrive at date is in the future', () => {
    assert.throws(() => command.exec({
      ...success_params,
      movement: MovementEntity.create({
        ...movement,
        arrive_at: now() + 10000
      })
    }), new RegExp(TroupError.MOVEMENT_NOT_ARRIVED))
  })

  it('should not create a temporary outpost if there is an existing city', () => {
    const { outpost } = command.exec({
      ...success_params,
      city_exists: true
    })
    assert.strictEqual(outpost, null)
  })

  it('should not create a temporary outpost if there is an existing city', () => {
    const { outpost } = command.exec({
      ...success_params,
      outpost_exists: true
    })
    assert.strictEqual(outpost, null)
  })

  it('should throw an error when we should create temporary outpost and limit is reached', () => {
    assert.throws(() => command.exec({
      ...success_params,
      existing_outposts_count: 1000
    }), new RegExp(OutpostError.LIMIT_REACHED))
  })

  it('should create a temporary outpost if there is no city or outpost', () => {
    const { outpost } = command.exec(success_params)

    assert.ok(outpost)
    assert.strictEqual(outpost.type, OutpostType.TEMPORARY)
    assert.strictEqual(outpost.player_id, player_id)
    assert.strictEqual(outpost.cell_id, destination_cell_id)
  })

  it('should move troups to the destination', () => {
    const {
      base_movement_id,
      updated_troups,
      delete_troup_ids
    } = command.exec(success_params)

    assert.strictEqual(delete_troup_ids.length, 2)
    assert.strictEqual(delete_troup_ids[0], movement_troup_id)

    assert.strictEqual(updated_troups.length, 2)

    const updated_explorer = updated_troups.find(t => t.code === TroupCode.EXPLORER)
    const updated_settler = updated_troups.find(t => t.code === TroupCode.SETTLER)
    assert.ok(updated_explorer)
    assert.ok(updated_settler)

    assert.strictEqual(updated_explorer.count, destination_troup_explorer.count + movement_troup_explorer.count)
    assert.strictEqual(updated_settler.count, movement_troup_settler.count)
    updated_troups.forEach(troup => {
      assert.strictEqual(troup.cell_id, destination_cell_id)
    })

    assert.strictEqual(base_movement_id, movement.id)
  })

  it('should create a report describing the explored cell', () => {
    const { report } = command.exec(success_params)

    assert.strictEqual(report.troups.length, 2)
    assert.strictEqual(report.was_read, false)

    const report_explorer = report.troups.find(t => t.code === TroupCode.EXPLORER)
    const report_settler = report.troups.find(t => t.code === TroupCode.SETTLER)
    assert.ok(report_explorer)
    assert.ok(report_settler)

    assert.strictEqual(report_explorer.count, movement_troup_explorer.count)
    assert.strictEqual(report_settler.count, report_settler.count)
  })
})
