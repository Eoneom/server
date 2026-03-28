import { TroopCode } from '#core/troop/constant/code'
import { TroopEntity } from '#core/troop/entity'
import assert from 'assert'

describe('TroopEntity', () => {
  const cell_id = 'cell_id'
  const player_id = 'player_id'

  describe('progressRecruitment', () => {
    it('should finish recruitment when progress time is greater than finish time', () => {
      const troop = TroopEntity.create({
        ...TroopEntity.init({
          cell_id,
          player_id,
          code: TroopCode.EXPLORER
        }),
        ongoing_recruitment: {
          finish_at: 10,
          last_progress: 5,
          remaining_count: 10
        }
      })

      const updated_troop = troop.progressRecruitment({ progress_time: 11 })

      assert.strictEqual(updated_troop.count, 10)
      assert.strictEqual(updated_troop.ongoing_recruitment, null)
    })

    describe('partial progress', () => {
      it('should progress a bit based on progress time, remaining troops and finish time', () => {
        const troop = TroopEntity.create({
          ...TroopEntity.init({
            cell_id,
            player_id,
            code: TroopCode.EXPLORER
          }),
          ongoing_recruitment: {
            finish_at: 20,
            last_progress: 10,
            remaining_count: 10
          }
        })

        const progress_time = 15
        const updated_troop = troop.progressRecruitment({ progress_time })

        assert.strictEqual(updated_troop.count, 5)
        assert.ok(updated_troop.ongoing_recruitment?.finish_at)
        assert.ok(troop.ongoing_recruitment?.finish_at)
        assert.strictEqual(updated_troop.ongoing_recruitment.finish_at, troop.ongoing_recruitment?.finish_at)
        assert.strictEqual(updated_troop.ongoing_recruitment.last_progress, progress_time)
        assert.strictEqual(updated_troop.ongoing_recruitment.remaining_count, 5)
      })

      it('should not recruit troop before finish time', () => {
        const troop = TroopEntity.create({
          ...TroopEntity.init({
            cell_id,
            player_id,
            code: TroopCode.EXPLORER
          }),
          ongoing_recruitment: {
            finish_at: 3000,
            last_progress: 0,
            remaining_count: 1
          }
        })

        const progress_time = 1000
        const updated_troop = troop.progressRecruitment({ progress_time })

        assert.strictEqual(updated_troop.count, 0)
        assert.ok(updated_troop.ongoing_recruitment?.finish_at)
        assert.ok(troop.ongoing_recruitment?.finish_at)
        assert.strictEqual(updated_troop.ongoing_recruitment.finish_at, troop.ongoing_recruitment?.finish_at)
        assert.strictEqual(updated_troop.ongoing_recruitment.last_progress, 0)
        assert.strictEqual(updated_troop.ongoing_recruitment.remaining_count, 1)
      })
    })
  })
})
