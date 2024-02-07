import { TroupCode } from '#core/troup/constant/code'
import { MovementAction } from '#core/troup/constant/movement-action'
import { TroupEntity } from '#core/troup/entity'
import { TroupError } from '#core/troup/error'
import { TroupService } from '#core/troup/service'
import { TroupCount } from '#core/troup/type'
import { Coordinates } from '#core/world/value/coordinates'
import { now } from '#shared/time'
import assert from 'assert'

describe('TroupService', () => {
  const player_id = 'player_id'

  describe('createMovementWithTroups', () => {
    it('should return the movement with the assigned troups', () => {
      const move_troups: TroupCount[] = [
        {
          code: TroupCode.EXPLORER,
          count: 1
        }
      ]
      const start_at = now()
      const action = MovementAction.BASE
      const origin: Coordinates = {
        sector: 1,
        x: 2,
        y: 3
      }
      const destination: Coordinates = {
        sector: 4,
        x: 5,
        y: 6
      }
      const {
        movement,
        troups
      } = TroupService.createMovementWithTroups({
        move_troups,
        action,
        player_id,
        start_at,
        origin,
        destination,
        distance: 10000
      })

      assert.strictEqual(movement.action, action)
      assert.strict(movement.player_id, player_id)
      assert.deepStrictEqual(movement.origin, origin)
      assert.deepStrictEqual(movement.destination, destination)
      assert.ok(movement.arrive_at > start_at)

      assert.strictEqual(troups.length, 1)
      const troup = troups[0]
      assert.strictEqual(troup.code, TroupCode.EXPLORER)
      assert.strictEqual(troup.count, 1)
      assert.strictEqual(troup.player_id, player_id)
      assert.strictEqual(troup.movement_id, movement.id)
      assert.strictEqual(troup.ongoing_recruitment, null)
      assert.strictEqual(troup.cell_id, null)
    })
  })

  describe('removeTroups', () => {
    it('should remove troups from the origin troups', () => {
      const origin_troups = [
        TroupEntity.create({
          id: 'settler',
          player_id,
          code: TroupCode.SETTLER,
          count: 10,
          ongoing_recruitment: null,
          movement_id: null,
          cell_id: 'cell_id'
        }),
        TroupEntity.create({
          id: 'explorer',
          player_id,
          code: TroupCode.EXPLORER,
          count: 20,
          ongoing_recruitment: null,
          movement_id: null,
          cell_id: 'cell_id'
        })
      ]

      const remove_troups = [
        {
          code: TroupCode.EXPLORER,
          count: 2
        }
      ]

      const result = TroupService.removeTroups({
        origin_troups,
        remove_troups
      })

      assert.strictEqual(result[0].count, 10)
      assert.strictEqual(result[1].count, 18)
    })
  })

  describe('haveEnoughTroups', () => {
    it('should return false when there is a missing troup in origin', () => {
      const origin_troups = [
        {
          code: TroupCode.SETTLER,
          count: 1
        },
      ]

      const move_troups = [
        {
          code: TroupCode.SETTLER,
          count: 1
        },
        {
          code: TroupCode.EXPLORER,
          count: 1
        }
      ]

      const result = TroupService.haveEnoughTroups({
        origin_troups,
        move_troups
      })

      assert.strictEqual(result, false)
    })

    it('should return false when the origin troup is not above the move troups', () => {
      const origin_troups = [
        {
          code: TroupCode.SETTLER,
          count: 1
        },
        {
          code: TroupCode.EXPLORER,
          count: 1
        },
      ]

      const move_troups = [
        {
          code: TroupCode.SETTLER,
          count: 1
        },
        {
          code: TroupCode.EXPLORER,
          count: 2
        }
      ]

      const result = TroupService.haveEnoughTroups({
        origin_troups,
        move_troups
      })

      assert.strictEqual(result, false)
    })

    it('should return true when there is enough origin troups for the move troups', () => {
      const origin_troups = [
        {
          code: TroupCode.SETTLER,
          count: 1
        },
        {
          code: TroupCode.EXPLORER,
          count: 1
        },
      ]

      const move_troups = [
        {
          code: TroupCode.SETTLER,
          count: 1
        },
        {
          code: TroupCode.EXPLORER,
          count: 1
        }
      ]

      const result = TroupService.haveEnoughTroups({
        origin_troups,
        move_troups
      })

      assert.strictEqual(result, true)
    })
  })

  describe('move', () => {
    const origin_cell_id = 'origin_cell_id'
    const origin: Coordinates = {
      x: 1,
      y: 2,
      sector: 3
    }
    const destination: Coordinates = {
      x: 4,
      y: 5,
      sector: 6
    }
    const troup = TroupEntity.create({
      ...TroupEntity.init({
        player_id,
        cell_id: origin_cell_id,
        code: TroupCode.EXPLORER
      }),
      count: 10
    })
    const another_troup = TroupEntity.create({
      ...TroupEntity.init({
        player_id,
        cell_id: origin_cell_id,
        code: TroupCode.SETTLER
      }),
      count: 20
    })

    const troup_to_move = {
      code: TroupCode.EXPLORER,
      count: 1
    }
    let success_params: Parameters<typeof TroupService.move>[0]
    const start_at = now()

    beforeEach(() => {
      success_params = {
        action: MovementAction.BASE,
        origin,
        destination,
        distance: 10,
        start_at,
        origin_troups: [
          troup,
          another_troup
        ],
        troups_to_move: [ troup_to_move ]
      }
    })

    it('should prevent to move troups if there is not enough in origin', () => {
      assert.throws(() => TroupService.move({
        ...success_params,
        troups_to_move: [
          {
            code: TroupCode.EXPLORER,
            count: 11
          }
        ]
      }), new RegExp(TroupError.NOT_ENOUGH_TROUPS))
    })

    it('should create a new movement to represent the move action', () => {
      const { movement } = TroupService.move(success_params)

      assert.ok(movement)
      assert.strictEqual(movement.player_id, player_id)
      assert.strictEqual(movement.action, success_params.action)
      assert.deepStrictEqual(movement.origin, origin)
      assert.deepStrictEqual(movement.destination, destination)
      assert.ok(movement.arrive_at > start_at)
    })

    it('should remove troups to move from the origin', () => {
      const { origin_troups } = TroupService.move(success_params)

      assert.strictEqual(origin_troups.length, 2)
      const changed_troup = origin_troups.find(t => t.code === troup.code)
      assert.ok(changed_troup)
      assert.strictEqual(changed_troup.id, troup.id)
      assert.strictEqual(changed_troup.movement_id, null)
      assert.strictEqual(changed_troup.cell_id, origin_cell_id)
      assert.strictEqual(changed_troup.count, troup.count - troup_to_move.count)

      const unchanged_troup = origin_troups.find(t => t.code === another_troup.code)
      assert.ok(unchanged_troup)
      assert.strictEqual(unchanged_troup.id, another_troup.id)
      assert.strictEqual(unchanged_troup.movement_id, null)
      assert.strictEqual(unchanged_troup.cell_id, origin_cell_id)
      assert.strictEqual(unchanged_troup.count, another_troup.count)
    })

    it('should add troups to move to movement troups', () => {
      const {
        movement_troups,
        movement
      } = TroupService.move(success_params)

      assert.strictEqual(movement_troups.length, 1)
      const movement_troup = movement_troups[0]
      assert.ok(movement_troup.id !== troup.id)
      assert.strictEqual(movement_troup.code, troup_to_move.code)
      assert.strictEqual(movement_troup.count, troup_to_move.count)
      assert.strictEqual(movement_troup.movement_id, movement.id)
      assert.strictEqual(movement_troup.cell_id, null)
    })
  })

  describe('mergeTroupsInDestination', () => {
    const destination_cell_id = 'destination_cell_id'
    const movement_troup_id = 'movement_troup_id'
    const destination_troup_id = 'destination_troup_id'
    const movement_id = 'movement_id'
    it('should add the movement troups to the destination troups', () => {
      const movement_troup = TroupEntity.create({
        id: movement_troup_id,
        code: TroupCode.EXPLORER,
        player_id,
        cell_id: null,
        movement_id,
        count: 1,
        ongoing_recruitment: null
      })

      const destination_troup = TroupEntity.create({
        id: destination_troup_id,
        code: TroupCode.EXPLORER,
        player_id,
        cell_id: destination_cell_id,
        movement_id: null,
        count: 1,
        ongoing_recruitment: null
      })

      const { merged_troups } = TroupService.mergeTroupsInDestination({
        movement_troups: [ movement_troup ],
        destination_troups: [ destination_troup ],
      })

      assert.strictEqual(merged_troups.length, 1)
      const merged_troup = merged_troups[0]
      assert.strictEqual(merged_troup.id, destination_troup.id)
      assert.strictEqual(merged_troup.code, destination_troup.code)
      assert.strictEqual(merged_troup.count, movement_troup.count + destination_troup.count)
    })

    it('should set the cell id to movement troups if there is no destination troups', () => {
      const movement_troup = TroupEntity.create({
        id: movement_troup_id,
        code: TroupCode.EXPLORER,
        player_id,
        cell_id: null,
        movement_id,
        count: 1,
        ongoing_recruitment: null
      })

      const { merged_troups } = TroupService.mergeTroupsInDestination({
        movement_troups: [ movement_troup ],
        destination_troups: [],
      })

      assert.strictEqual(merged_troups.length, 1)
      const merged_troup = merged_troups[0]
      assert.strictEqual(merged_troup.code, movement_troup.code)
      assert.strictEqual(merged_troup.count, movement_troup.count)
    })
  })
})
