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
} from '#app/command/troup/finish/base'
import { Coordinates } from '#core/world/value/coordinates'
import { OutpostType } from '#core/outpost/constant/type'

describe('TroupFinishBaseCommand', () => {
  const player_id = 'player_id'
  const movement_id = 'movement_id'
  const movement_troup_id = 'movement_troup_id'
  const city_troup_id = 'city_troup_id'
  const origin_cell_id = 'origin_cell_id'
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
  let movement_troup: TroupEntity
  let destination_troup: TroupEntity
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

    movement_troup = TroupEntity.create({
      id: movement_troup_id,
      code: TroupCode.EXPLORER,
      player_id,
      cell_id: origin_cell_id,
      count: 2,
      ongoing_recruitment: null,
      movement_id: movement.id
    })

    destination_troup = TroupEntity.create({
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
      movement_troups: [ movement_troup ],
      destination_troups: [ destination_troup ],
      destination_cell_id,
      city_exists: false,
      outpost_exists: false
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

    assert.strictEqual(delete_troup_ids.length, 1)
    assert.strictEqual(delete_troup_ids[0], movement_troup_id)

    assert.strictEqual(updated_troups.length, 1)
    assert.strictEqual(updated_troups[0].count, destination_troup.count + movement_troup.count)

    assert.strictEqual(base_movement_id, movement.id)
  })

  it('should create a report describing the explored cell', () => {
    const { report } = command.exec(success_params)

    assert.strictEqual(report.troups.length, 1)
    assert.strictEqual(report.troups[0].code, TroupCode.EXPLORER)
    assert.strictEqual(report.troups[0].count, movement_troup.count)
  })
})
