import assert from 'assert'
import {
  MovementAction,
  TroupCode
} from '#core/troup/constant'
import { TroupError } from '#core/troup/error'
import { MovementEntity } from '#core/troup/movement.entity'
import { now } from '#shared/time'
import { TroupEntity } from '#core/troup/entity'
import {
  TroupFinishBaseCommand,
  TroupFinishBaseCommandExec
} from '#app/command/troup/finish/base'

describe('TroupFinishBaseCommand', () => {
  const player_id = 'player_id'
  const city_id = 'city_id'
  const movement_id = 'movement_id'
  const movement_troup_id = 'movement_troup_id'
  const city_troup_id = 'city_troup_id'
  let movement: MovementEntity
  let movement_troup: TroupEntity
  let city_troup: TroupEntity
  let command: TroupFinishBaseCommand
  let success_params: TroupFinishBaseCommandExec

  beforeEach(() => {
    command = new TroupFinishBaseCommand()

    movement = MovementEntity.create({
      action: MovementAction.BASE,
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

    movement_troup = TroupEntity.create({
      id: movement_troup_id,
      code: TroupCode.EXPLORER,
      player_id,
      city_id,
      count: 1,
      ongoing_recruitment: null,
      movement_id: movement.id
    })

    city_troup = TroupEntity.create({
      id: city_troup_id,
      code: TroupCode.EXPLORER,
      player_id,
      city_id,
      count: 1,
      ongoing_recruitment: null,
      movement_id: null
    })

    success_params = {
      movement,
      player_id,
      troups: [ movement_troup ],
      city_troups: [ city_troup ]
    }
  })

  it('should prevent a player for finishing a movement of another player', () => {
    assert.throws(() => command.exec({
      ...success_params,
      troups: [
        TroupEntity.create({
          ...movement_troup,
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

  it('should move troups to the city', () => {
    const {
      base_movement_id,
      city_troups,
      delete_troup_ids
    } = command.exec(success_params)

    assert.strictEqual(delete_troup_ids.length, 1)
    assert.strictEqual(delete_troup_ids[0], movement_troup_id)

    assert.strictEqual(city_troups.length, 1)
    assert.strictEqual(city_troups[0].count, city_troup.count + movement_troup.count)

    assert.strictEqual(base_movement_id, movement.id)
  })
})
