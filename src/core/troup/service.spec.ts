import { TroupCode } from '#core/troup/constant/code'
import { MovementAction } from '#core/troup/constant/movement-action'
import { TroupEntity } from '#core/troup/entity'
import { TroupError } from '#core/troup/error'
import { TroupService } from '#core/troup/service'
import { Coordinates } from '#core/world/value/coordinates'
import { now } from '#shared/time'
import assert from 'assert'

describe('TroupService', () => {
  const player_id = 'player_id'

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
        destination_cell_id
      })

      assert.strictEqual(merged_troups.length, 1)
      const merged_troup = merged_troups[0]
      assert.strictEqual(merged_troup.id, destination_troup.id)
      assert.strictEqual(merged_troup.code, destination_troup.code)
      assert.strictEqual(merged_troup.count, movement_troup.count + destination_troup.count)
      assert.strictEqual(merged_troup.cell_id, destination_cell_id)
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
        destination_cell_id
      })

      assert.strictEqual(merged_troups.length, 1)
      const merged_troup = merged_troups[0]
      assert.strictEqual(merged_troup.code, movement_troup.code)
      assert.strictEqual(merged_troup.count, movement_troup.count)
      assert.strictEqual(merged_troup.cell_id, destination_cell_id)
    })
  })
})
