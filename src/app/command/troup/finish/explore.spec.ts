import assert from 'assert'
import {
  TroupFinishExploreCommand,
  TroupFinishExploreCommandExec
} from '#app/command/troup/finish/explore'
import { TroupCode } from '#core/troup/constant/code'
import { MovementAction } from '#core/troup/constant/movement-action'
import { TroupError } from '#core/troup/error'
import { MovementEntity } from '#core/troup/movement.entity'
import { now } from '#shared/time'
import { TroupEntity } from '#core/troup/entity'
import { ExplorationEntity } from '#core/world/exploration.entity'

describe('TroupFinishExploreCommand', () => {
  const player_id = 'player_id'
  const movement_id = 'movement_id'
  const troup_id = 'troup_id'
  const exploration_id = 'exploration_id'
  const already_explored_cell_id = 'already_explored_cell_id'
  const cell_id = 'cell_id'
  const city_cell_id = 'city_cell_id'
  let movement: MovementEntity
  let troup: TroupEntity
  let exploration: ExplorationEntity
  let command: TroupFinishExploreCommand
  let success_params: TroupFinishExploreCommandExec

  beforeEach(() => {
    command = new TroupFinishExploreCommand()

    movement = MovementEntity.create({
      id: movement_id,
      player_id,
      action: MovementAction.EXPLORE,
      origin: {
        sector: 1,
        x: 2,
        y: 3
      },
      destination: {
        sector: 4,
        x: 5,
        y: 6
      },
      arrive_at: now() - 5000
    })

    troup = TroupEntity.create({
      id: troup_id,
      code: TroupCode.EXPLORER,
      player_id,
      cell_id: city_cell_id,
      count: 1,
      ongoing_recruitment: null,
      movement_id: movement.id
    })

    exploration = ExplorationEntity.create({
      id: exploration_id,
      player_id,
      cell_ids: [ already_explored_cell_id ]
    })

    success_params = {
      movement,
      player_id,
      troups: [ troup ],
      exploration,
      explored_cell_ids: [ cell_id ]
    }
  })

  it('should prevent a player for finishing a movement of another player', () => {
    assert.throws(() => command.exec({
      ...success_params,
      troups: [
        TroupEntity.create({
          ...troup,
          player_id: 'another_player_id'
        })
      ]
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

  it('should mark the cell as explored', () => {
    const { exploration } = command.exec(success_params)

    assert.strictEqual(exploration.cell_ids.length, 2)
    assert.ok(exploration.cell_ids.some(cell_id => cell_id ))
  })

  it('should send the troup back to base at the origin', () => {
    const {
      base_movement: movement_to_create,
      explore_movement_id: movement_id_to_delete,
      troup
    } = command.exec(success_params)

    assert.strictEqual(movement_id_to_delete, movement.id)
    assert.strictEqual(movement_to_create.action, MovementAction.BASE)
    assert.strictEqual(troup.movement_id, movement_to_create.id)
  })

  it('should create a report describing the explored cell', () => {
    const { report } = command.exec(success_params)

    assert.strictEqual(report.troups.length, 1)
    assert.strictEqual(report.troups[0].code, TroupCode.EXPLORER)
  })
})
