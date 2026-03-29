import {
  STARTING_MUSHROOM,
  STARTING_PLASTIC
} from '#core/city/constant'
import { CityError } from '#core/city/error'
import { ResourcesService } from '#core/resources/service'
import assert from 'assert'

describe('ResourcesService', () => {
  describe('randomResourceStockState', () => {
    it('respects inclusive bounds with fixed RNG', () => {
      const r = ResourcesService.randomResourceStockState({
        gather_at: 100,
        random: () => 0
      })
      assert.strictEqual(r.plastic, 0)
      assert.strictEqual(r.mushroom, 0)

      const r2 = ResourcesService.randomResourceStockState({
        gather_at: 100,
        random: () => 0.999999
      })
      assert.strictEqual(r2.plastic, STARTING_PLASTIC)
      assert.strictEqual(r2.mushroom, STARTING_MUSHROOM)
    })
  })

  describe('randomIntInclusive', () => {
    it('returns max when random approaches 1', () => {
      assert.strictEqual(ResourcesService.randomIntInclusive({ max: 5, random: () => 0.999 }), 5)
    })
  })

  const base_state = {
    plastic: STARTING_PLASTIC,
    mushroom: STARTING_MUSHROOM,
    last_plastic_gather: 1_000,
    last_mushroom_gather: 1_000
  }

  describe('purchaseResourceStock', () => {
    it('throws when not enough', () => {
      assert.throws(() => ResourcesService.purchaseResourceStock({
        state: base_state,
        resource: { plastic: 999_999, mushroom: 0 }
      }), new RegExp(CityError.NOT_ENOUGH_RESOURCES))
    })

    it('deducts', () => {
      const next = ResourcesService.purchaseResourceStock({
        state: base_state,
        resource: { plastic: 10, mushroom: 20 }
      })
      assert.strictEqual(next.plastic, STARTING_PLASTIC - 10)
      assert.strictEqual(next.mushroom, STARTING_MUSHROOM - 20)
    })
  })

  describe('refundResourceStock', () => {
    it('adds resources', () => {
      const next = ResourcesService.refundResourceStock({
        state: base_state,
        resource: { plastic: 5, mushroom: 7 }
      })
      assert.strictEqual(next.plastic, STARTING_PLASTIC + 5)
      assert.strictEqual(next.mushroom, STARTING_MUSHROOM + 7)
    })
  })

  describe('gatherResourceStock', () => {
    it('no update when no earnings and zero rates', () => {
      const { next, updated } = ResourcesService.gatherResourceStock({
        state: base_state,
        gather_at_time: base_state.last_plastic_gather + 1000,
        earnings_per_second: { plastic: 0, mushroom: 0 },
        warehouses_capacity: { plastic: 100_000, mushroom: 100_000 }
      })
      assert.strictEqual(updated, false)
      assert.strictEqual(next.plastic, base_state.plastic)
    })

    it('gathers when enough time passed', () => {
      const plastic_eps = 1000
      const mushroom_eps = 500
      const seconds = 3
      const { next, updated } = ResourcesService.gatherResourceStock({
        state: base_state,
        gather_at_time: base_state.last_plastic_gather + seconds * 1000,
        earnings_per_second: { plastic: plastic_eps, mushroom: mushroom_eps },
        warehouses_capacity: { plastic: 1_000_000, mushroom: 1_000_000 }
      })
      assert.strictEqual(updated, true)
      assert.strictEqual(next.plastic, base_state.plastic + seconds * plastic_eps)
      assert.strictEqual(next.mushroom, base_state.mushroom + seconds * mushroom_eps)
    })
  })
})
