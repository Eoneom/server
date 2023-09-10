import { TroupEntity } from '#core/troup/entity'
import assert from 'assert'

describe('TroupEntity', () => {
  const city_id = 'city_id'
  const player_id = 'player_id'

  describe('progressRecruitment', () => {
    it('should finish recruitment when progress time is greater than finish time', () => {
      const troup = TroupEntity.create({
        ...TroupEntity.initExplorer({
          city_id,
          player_id
        }),
        ongoing_recruitment: {
          finish_at: 10,
          last_progress: 5,
          remaining_count: 10
        }
      })

      const updated_troup = troup.progressRecruitment({ progress_time: 11 })

      assert.strictEqual(updated_troup.count, 10)
      assert.strictEqual(updated_troup.ongoing_recruitment, null)
    })

    describe('partial progress', () => {
      it('should progress a bit based on progress time, remaining troups and finish time', () => {
        const troup = TroupEntity.create({
          ...TroupEntity.initExplorer({
            city_id,
            player_id
          }),
          ongoing_recruitment: {
            finish_at: 20,
            last_progress: 10,
            remaining_count: 10
          }
        })

        const progress_time = 15
        const updated_troup = troup.progressRecruitment({ progress_time })

        assert.strictEqual(updated_troup.count, 5)
        assert.ok(updated_troup.ongoing_recruitment?.finish_at)
        assert.ok(troup.ongoing_recruitment?.finish_at)
        assert.strictEqual(updated_troup.ongoing_recruitment.finish_at, troup.ongoing_recruitment?.finish_at)
        assert.strictEqual(updated_troup.ongoing_recruitment.last_progress, progress_time)
        assert.strictEqual(updated_troup.ongoing_recruitment.remaining_count, 5)
      })

      it('should not recruit troup before finish time', () => {
        const troup = TroupEntity.create({
          ...TroupEntity.initExplorer({
            city_id,
            player_id
          }),
          ongoing_recruitment: {
            finish_at: 3000,
            last_progress: 0,
            remaining_count: 1
          }
        })

        const progress_time = 1000
        const updated_troup = troup.progressRecruitment({ progress_time })

        assert.strictEqual(updated_troup.count, 0)
        assert.ok(updated_troup.ongoing_recruitment?.finish_at)
        assert.ok(troup.ongoing_recruitment?.finish_at)
        assert.strictEqual(updated_troup.ongoing_recruitment.finish_at, troup.ongoing_recruitment?.finish_at)
        assert.strictEqual(updated_troup.ongoing_recruitment.last_progress, 0)
        assert.strictEqual(updated_troup.ongoing_recruitment.remaining_count, 1)
      })
    })
  })
})
