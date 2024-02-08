import { TroupCode } from '#core/troup/constant/code'
import { TroupEntity } from '#core/troup/entity'
import { TroupService } from '#core/troup/service'
import assert from 'assert'

describe('TroupService', () => {
  const player_id = 'player_id'
  const cell_id = 'cell_id'

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

  describe('splitTroups', () => {
    const initial_troups = [
      TroupEntity.create({
        id: 'initial-settler-id',
        count: 10,
        code: TroupCode.SETTLER,
        player_id,
        cell_id,
        ongoing_recruitment: null,
        movement_id: null,
      }),
      TroupEntity.create({
        id: 'initial-explored-id',
        count: 20,
        code: TroupCode.EXPLORER,
        player_id,
        cell_id,
        ongoing_recruitment: null,
        movement_id: null,
      })
    ]

    const troups_to_split = [
      {
        code: TroupCode.SETTLER,
        count: 4
      },
      {
        code: TroupCode.EXPLORER,
        count: 3
      }
    ]

    it('should remove split troups from initial troups', () => {
      const { updated_origin_troups } = TroupService.splitTroups({
        origin_troups: initial_troups,
        troups_to_split
      })

      assert.strictEqual(updated_origin_troups.length, 2)
      const settler = updated_origin_troups[0]
      const explorer = updated_origin_troups[1]

      assert.strictEqual(settler.code, TroupCode.SETTLER)
      assert.strictEqual(settler.id, initial_troups[0].id)
      assert.strictEqual(settler.count, 6)

      assert.strictEqual(explorer.code, TroupCode.EXPLORER)
      assert.strictEqual(explorer.id, initial_troups[1].id)
      assert.strictEqual(explorer.count, 17)
    })

    it('should create new splitted troups', () => {
      const { splitted_troups } = TroupService.splitTroups({
        origin_troups: initial_troups,
        troups_to_split
      })

      assert.strictEqual(splitted_troups.length, 2)
      const settler = splitted_troups[0]
      const explorer = splitted_troups[1]

      assert.strictEqual(settler.code, TroupCode.SETTLER)
      assert.ok(settler.id !== initial_troups[0].id)
      assert.strictEqual(settler.count, 4)

      assert.strictEqual(explorer.code, TroupCode.EXPLORER)
      assert.ok(explorer.id !== initial_troups[1].id)
      assert.strictEqual(explorer.count, 3)
    })
  })

  describe('mergeTroups', () => {
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

      const merged_troups = TroupService.mergeTroups({
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

      const merged_troups = TroupService.mergeTroups({
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
