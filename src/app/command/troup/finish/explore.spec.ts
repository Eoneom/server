import assert from 'assert'
import {
  TroupFinishExploreCommand,
  TroupFinishExploreCommandExec
} from '#app/command/troup/finish/explore'
import {
  MovementAction,
  TroupCode
} from '#core/troup/constant'
import { TroupError } from '#core/troup/error'
import { MovementEntity } from '#core/troup/movement.entity'
import { now } from '#shared/time'
import { TroupEntity } from '#core/troup/entity'

describe.only('TroupFinishExploreCommand', () => {
  const player_id = 'player_id'
  const city_id = 'city_id'
  const movement_id = 'movement_id'
  const troup_id = 'troup_id'
  let movement: MovementEntity
  let troup: TroupEntity
  let command: TroupFinishExploreCommand
  let success_params: TroupFinishExploreCommandExec

  beforeEach(() => {
    command = new TroupFinishExploreCommand()

    movement = MovementEntity.create({
      action: MovementAction.EXPLORE,
      id: movement_id,
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
      city_id,
      count: 1,
      ongoing_recruitment: null,
      movement_id: movement.id
    })

    success_params = {
      movement,
      player_id,
      troups: [ troup ]
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
})
